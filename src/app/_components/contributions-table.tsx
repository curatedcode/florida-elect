"use client";

import { Button } from "@/app/_components/button";
import { cn } from "@/app/_utils/cn";
import { api } from "@/trpc/react";
import { DollarSign } from "lucide-react";

export type ContributionsTableProps = {
	candidateId: number;
};

export function ContributionsTable({ candidateId }: ContributionsTableProps) {
	const [{ pages }, query] = api.contributor.infinite.useSuspenseInfiniteQuery(
		{
			candidateId,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

	const hasContributions = pages.some((page) => page.contributors.length > 0);

	return (
		<div
			className={cn([
				"flex flex-col gap-6 rounded-sm border border-gray-4 bg-white py-3 shadow-sm",
				pages.length === 0 && "pb-12",
			])}
		>
			<div className="flex items-center gap-2 border-gray-4 border-b pb-2 pl-4 md:border-transparent md:pb-0">
				<DollarSign />
				<h2 className="font-semibold text-xl">Contributions</h2>
			</div>
			{hasContributions ? (
				<>
					<div className="flow-root">
						<div className="overflow-x-auto">
							<div className="inline-block min-w-full align-middle">
								<table className="w-full min-w-full">
									<thead>
										<tr className="text-left">
											<th className="pr-4 pb-2 pl-2.5 font-medium text-lg">
												Name
											</th>
											<th className="pr-4 pb-2 font-medium text-lg">Amount</th>
											<th className="pr-4 pb-2 font-medium text-lg">
												Earliest
											</th>
											<th className="pr-4 pb-2 font-medium text-lg">Last</th>
											<th className="pr-2.5 pb-2 font-medium text-lg">Count</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-4">
										{pages.flatMap((page) =>
											page.contributors.map((contributor) => {
												const earliestDate = new Date(
													contributor.earliestDate,
												).toLocaleString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												});
												const latestDate = new Date(
													contributor.latestDate,
												).toLocaleString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												});

												const amount = contributor.amount.toLocaleString(
													"en-US",
													{
														minimumFractionDigits: 0,
														maximumFractionDigits: 2,
													},
												);

												return (
													<tr key={contributor.id}>
														<td className="whitespace-nowrap py-2 pr-3 pl-2.5">
															{contributor.name}
														</td>
														<td className="whitespace-nowrap py-2 pr-3">
															${amount}
														</td>
														<td className="whitespace-nowrap py-2 pr-3">
															{earliestDate}
														</td>
														<td className="whitespace-nowrap py-2 pr-3">
															{latestDate}
														</td>
														<td className="whitespace-nowrap py-2 pr-2.5">
															{contributor.count}
														</td>
													</tr>
												);
											}),
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					{hasNextPage && (
						<div className="w-full px-2.5">
							<Button
								variant="ghost"
								onClick={() => fetchNextPage()}
								className="w-full"
								disabled={isFetchingNextPage}
							>
								Load more...
							</Button>
						</div>
					)}
				</>
			) : (
				<span className="pb-6 text-center text-gray-9">
					No contributors available
				</span>
			)}
		</div>
	);
}
