import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { candidates, districts, elections, results } from "@/server/db/schema";
import { zElections } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const electionRouter = createTRPCRouter({
	/**
	 * Fetches all election data and candidate date needed the the <MapProvider /> component.
	 */
	mapContextPrefetch: publicProcedure
		.input(
			z.object({
				type: zElections,
			}),
		)
		.query(async ({ ctx }) => {
			const electionsData = await ctx.db
				.select({
					id: elections.id,
					date: elections.date,
					districtId: elections.districtId,
					type: elections.type,
					resultCount: sql<number>`count(${results.id})`.as("result_count"),
					districtNumber: districts.number,
					winnerCandidateId: results.candidateId,
				})
				.from(elections)
				.innerJoin(districts, eq(elections.districtId, districts.id))
				.leftJoin(results, eq(results.electionId, elections.id))
				.where(
					and(eq(elections.type, "State Senate"), eq(results.winner, true)),
				)
				.groupBy(
					elections.id,
					elections.date,
					elections.districtId,
					elections.type,
					districts.number,
					results.candidateId,
				);

			const allResults = await ctx.db
				.select({
					electionId: results.electionId,
					candidate: candidates,
					votes: results.votes,
					voteShare: results.voteShare,
				})
				.from(results)
				.innerJoin(candidates, eq(results.candidateId, candidates.id));

			const candidatesByElection: Record<
				string,
				((typeof allResults)[0]["candidate"] & {
					votes: number;
					voteShare: number;
				})[]
			> = {};

			for (const row of allResults) {
				const id = row.electionId.toString();
				if (!candidatesByElection[id]) candidatesByElection[id] = [];
				candidatesByElection[id].push({
					...row.candidate,
					votes: row.votes,
					voteShare: row.voteShare,
				});
			}

			return electionsData.map((election) => {
				const candidatesInElection = candidatesByElection[election.id];

				return {
					...election,
					winner: candidatesInElection?.find(
						(c) => c.id === election.winnerCandidateId,
					) as typeof candidates.$inferSelect & { votes: number },
					candidates: candidatesInElection ?? [],
				};
			});
		}),
});
