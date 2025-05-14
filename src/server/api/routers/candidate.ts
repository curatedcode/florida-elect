import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { candidates, elections, results } from "@/server/db/schema";
import type { zElections } from "@/types";
import { asc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

type ElementType<T> = T extends (infer U)[] ? U : T;

type ElectionCandidate = {
	voteShare: number;
} & typeof candidates.$inferSelect;

type Candidate = {
	elections: {
		id: number;
		date: string;
		district: number;
		type: z.infer<typeof zElections>;
		totalVotes: number;
		winner: ElectionCandidate;
		candidates: ElectionCandidate[];
	}[];
} & typeof candidates.$inferSelect;

export const candidateRouter = createTRPCRouter({
	getOne: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ ctx, input }): Promise<Candidate | undefined> => {
			const allResults = alias(results, "allResults");

			const baseQuery = await ctx.db
				.select({
					candidate: candidates,
				})
				.from(candidates)
				.where(eq(candidates.id, input.id));

			if (baseQuery.length === 0) return undefined;

			const firstRow = baseQuery[0];
			if (!firstRow?.candidate) return undefined;

			const baseCandidateData = firstRow.candidate;

			const electionData = await ctx.db
				.select({
					baseResult: results,
					election: elections,
					allResult: allResults,
					otherCandidate: candidates,
				})
				.from(results)
				.where(eq(results.candidateId, input.id))
				.innerJoin(elections, eq(elections.id, results.electionId))
				.innerJoin(allResults, eq(allResults.electionId, elections.id))
				.leftJoin(candidates, eq(allResults.candidateId, candidates.id));

			const electionsMap = new Map<
				number,
				ElementType<Candidate["elections"]>
			>();

			for (const row of electionData) {
				if (!row.election || !row.allResult || !row.otherCandidate) {
					continue;
				}

				const electionId = row.election.id;

				if (!electionsMap.has(electionId)) {
					const initialCandidate: ElectionCandidate = {
						...row.otherCandidate,
						voteShare: row.allResult.voteShare,
					};

					electionsMap.set(electionId, {
						id: row.election.id,
						date: row.election.date,
						district: row.election.districtId,
						type: row.election.type,
						totalVotes: 0,
						winner: initialCandidate,
						candidates: [],
					});
				}

				const electionEntry = electionsMap.get(electionId);
				if (!electionEntry) {
					continue;
				}

				const candidateEntry: ElectionCandidate = {
					...row.otherCandidate,
					voteShare: row.allResult.voteShare,
				};

				const existingCandidateIndex = electionEntry.candidates.findIndex(
					(c) => c.id === candidateEntry.id,
				);

				if (existingCandidateIndex === -1) {
					electionEntry.candidates.push(candidateEntry);
					electionEntry.totalVotes += row.allResult.voteShare;

					if (candidateEntry.voteShare > electionEntry.winner.voteShare) {
						electionEntry.winner = candidateEntry;
					}
				}
			}

			return {
				...baseCandidateData,
				elections: Array.from(electionsMap.values()),
			};
		}),
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db
			.select({
				id: candidates.id,
				name: candidates.name,
				image: candidates.image,
				party: candidates.party,
				resultCount: sql<number>`count(${results.id})`.as("result_count"),
			})
			.from(candidates)
			.orderBy(asc(candidates.name))
			.leftJoin(results, eq(results.candidateId, candidates.id))
			.groupBy(
				candidates.id,
				candidates.name,
				candidates.image,
				candidates.party,
			);

		return data;
	}),
});
