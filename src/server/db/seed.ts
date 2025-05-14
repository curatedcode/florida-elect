import "dotenv/config";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { env } from "@/env";
import { zPartyAbbreviation } from "@/types";
import { preparedMapDistricts } from "@/types/map";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import sanitize from "sanitize-filename";
import { allSeedData } from "seed-data/all-seed-data";
import {
	candidates,
	contributors,
	districts,
	elections,
	results,
} from "./schema";

const db = drizzle(env.DATABASE_URL);

function askQuestion(query: string): Promise<string> {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer.trim());
		}),
	);
}

async function resetDatabase() {
	const answer = await askQuestion(
		"⚠️  Are you sure you want to reset the database? This will DELETE EVERYTHING. Type 'DELETE' to confirm: ",
	);

	if (answer === "DELETE") {
		console.log("🔨 Dropping and recreating public schema...");
		await db.execute(sql`DROP SCHEMA public CASCADE`);
		await db.execute(sql`CREATE SCHEMA public`);
		console.log("✅ Database reset complete.");

		console.log("🚀 Running `pnpm db:push`...");
		try {
			execSync("pnpm db:push", { stdio: "inherit" });
			console.log("✅ Migration pushed.");
		} catch (err) {
			console.error("❌ Failed to push migration:", err);
		}
	} else {
		console.log("❌ Operation cancelled.");
	}
}

async function createDistricts() {
	const districtsFormatted: (typeof districts.$inferInsert)[] =
		preparedMapDistricts.map((d) => ({
			number: d.DISTRICT,
			state: "Florida",
		}));

	console.log("Creating districts...");
	return await db.insert(districts).values(districtsFormatted).returning();
}

async function createCandidates() {
	const data: (typeof candidates.$inferInsert)[] = [];

	for (const election of allSeedData) {
		for (const candidate of election.candidates) {
			const party = zPartyAbbreviation.safeParse(candidate.party);

			data.push({
				image: sanitize(candidate.name),
				name: candidate.name,
				party: party.success ? party.data : "UNK",
			});
		}
	}

	console.log("Creating candidates...");
	return await db.insert(candidates).values(data).returning();
}

async function createElections(
	allDistricts: (typeof districts.$inferSelect)[],
) {
	const electionData: (typeof elections.$inferInsert)[] = [];

	for (const election of allSeedData) {
		const district = allDistricts.find(
			(d) => d.number === election.district.first,
		);

		if (!district)
			throw new Error(`District ${election.district.first} not found`);

		electionData.push({
			date: election.date,
			districtId: district.id,
			type: "State Senate",
		});
	}

	console.log("Creating elections...");
	return await db.insert(elections).values(electionData).returning();
}

async function createResults({
	allDistricts,
	allCandidates,
	allElections,
}: {
	allDistricts: (typeof districts.$inferSelect)[];
	allCandidates: (typeof candidates.$inferSelect)[];
	allElections: (typeof elections.$inferSelect)[];
}) {
	const resultsData: (typeof results.$inferInsert)[] = [];

	for (const election of allSeedData) {
		const thisElection = allElections.find((e) => {
			const districtNumber = allDistricts.find(
				(d) => d.id === e.districtId,
			)?.number;
			if (districtNumber !== election.district.first) return false;
			if (e.date !== election.date) return false;

			return true;
		});

		if (!thisElection) {
			console.log(
				"[!] Election not found for",
				`Race: ${election.race.name} Date: ${election.date} District: ${election.district.first}`,
			);
			break;
		}

		for (const candidate of election.candidates) {
			const thisCandidate = allCandidates.find(
				(c) => c.name === candidate.name,
			);

			if (!thisCandidate) {
				console.log(
					"[!] Candidate not found for",
					`Race: ${election.race.name} Date: ${election.date} District: ${election.district.first} Candidate: ${candidate.name}`,
				);
				break;
			}

			resultsData.push({
				electionId: thisElection.id,
				candidateId: thisCandidate.id,
				districtId: thisElection.districtId,
				votes: election.totalVotes,
				voteShare: candidate.votes,
				winner: election.winner.name === candidate.name,
			});
		}
	}

	console.log("Creating results...");
	return await db.insert(results).values(resultsData).returning();
}

async function createContributors(
	allCandidates: (typeof candidates.$inferSelect)[],
) {
	const contributorsData: (typeof contributors.$inferInsert)[] = [];

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const file = await fs.readFile(
		path.join(__dirname, "../../../seed-data/contributions.json"),
		"utf-8",
	);
	const json = JSON.parse(file) as {
		[key: string]: {
			date: {
				earliest: string;
				latest: string;
			};
			totalAmount: number;
			contributionCount: number;
			name: string;
			addresses: {
				street: string;
				city: string;
				state: string;
				zipCode?: number;
			}[];
			occupations: string[];
		}[];
	};

	for (const [key, contributors] of Object.entries(json)) {
		const candidate = allCandidates.find((c) => c.name === key);

		if (!candidate) {
			throw new Error(`Candidate ${key} not found.`);
		}

		for (const contributor of contributors) {
			contributorsData.push({
				candidateId: candidate.id,
				amount: contributor.totalAmount,
				earliestDate: contributor.date.earliest,
				latestDate: contributor.date.latest,
				name: contributor.name,
				count: contributor.contributionCount,
			});
		}
	}

	console.log(`Collected ${contributorsData.length} contributors.`);
	console.log("Creating contributors in batches...");

	const batchSize = 500;
	const totalBatches = Math.ceil(contributorsData.length / batchSize);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * batchSize;
		const end = start + batchSize;
		const batch = contributorsData.slice(start, end);

		try {
			await db.insert(contributors).values(batch);
			console.log(`Inserted batch ${i + 1}/${totalBatches}`);
		} catch (error) {
			console.error(`Error inserting batch ${i + 1}:`, error);
			throw error;
		}
	}

	console.log("Finished creating contributors.");
}

async function main() {
	await resetDatabase();
	console.log("[✓] Seeding database...");
	const allDistricts = await createDistricts();
	const allCandidates = await createCandidates();
	const allElections = await createElections(allDistricts);

	await createResults({ allDistricts, allCandidates, allElections });
	await createContributors(allCandidates);
	console.log("[✓] Database seeded successfully.");
	process.exit();
}

main();
