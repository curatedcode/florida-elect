import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contributors } from "@/server/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

export const contributorRouter = createTRPCRouter({
	infinite: publicProcedure
		.input(
			z.object({
				candidateId: z.number(),
				cursor: z.number().nullish(),
				// sortBy: zContributorsSortBy.default("Amount").optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const limit = 20;

			const data = await ctx.db
				.select()
				.from(contributors)
				.where(
					and(
						eq(contributors.candidateId, input.candidateId),
						input.cursor ? lt(contributors.amount, input.cursor) : undefined,
					),
				)
				.orderBy(desc(contributors.amount))
				.limit(limit + 1);

			let nextCursor: typeof input.cursor | undefined = undefined;

			if (data.length > limit) {
				const nextItem = data.pop();
				if (nextItem) {
					nextCursor = nextItem.amount;
				}
			}

			return {
				contributors: data,
				nextCursor,
			};
		}),
});
