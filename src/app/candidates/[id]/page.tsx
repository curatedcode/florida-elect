import { ContributionsTable } from "@/app/_components/contributions-table";
import { Image } from "@/app/_components/image";
import { cn } from "@/app/_utils/cn";
import { formatPercentage } from "@/app/_utils/format-percentage";
import { getPartyLabel } from "@/app/_utils/get-party-label";
import { db } from "@/server/db";
import { candidates } from "@/server/db/schema";
import { HydrateClient, api } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { Flag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;

	const data = await db
		.select({ name: candidates.name })
		.from(candidates)
		.where(eq(candidates.id, Number(id)));

	return {
		title: data[0]?.name ?? "Candidate",
	};
}

export async function generateStaticParams() {
	const data = await db.select({ id: candidates.id }).from(candidates);
	return data.map((c) => ({ id: c.id.toString() }));
}

export default async function Candidate({ params }: Props) {
	const _params = await params;
	const candidateId = Number(_params.id);

	if (Number.isNaN(candidateId)) {
		notFound();
	}

	const data = await api.candidate.getOne({ id: candidateId });
	await api.contributor.infinite.prefetchInfinite({ candidateId });

	if (!data) {
		notFound();
	}

	return (
		<div className="flex flex-col gap-6 pt-6 md:pt-12">
			<div className="flex flex-col gap-6 md:grid md:grid-cols-3">
				<div className="flex flex-col gap-3 rounded-sm border border-gray-4 bg-white p-2 shadow-sm">
					<Image
						src={`/images/candidates/${data.image}.webp`}
						alt={`${data.name} headshot`}
						className="mx-auto size-60 rounded-full"
						width={240}
						height={240}
						fallBack="/images/placeholder.webp"
					/>
					<h1 className="text-center font-semibold text-xl">{data.name}</h1>
					<span
						className={cn([
							"-mt-2 mx-auto inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 font-semibold text-white text-xs",
							data.party === "REP" &&
								"bg-party-republican/80 backdrop-blur-2xl",
							data.party === "DEM" && "bg-party-democrat/80 backdrop-blur-2xl",
							data.party !== "REP" &&
								data.party !== "DEM" &&
								"bg-party-other/80 backdrop-blur-2xl",
						])}
					>
						{getPartyLabel(data.party)}
					</span>
				</div>
				<div className="flex flex-col gap-6 rounded-sm border border-gray-4 bg-white py-3 shadow-sm md:col-span-2">
					<div className="flex items-center gap-2 border-gray-4 border-b pb-2 pl-4 md:border-transparent md:pb-0">
						<Flag />
						<h2 className="font-semibold text-xl">Election History</h2>
					</div>
					<div className="flow-root">
						<div className="overflow-x-auto">
							<div className="inline-block min-w-full align-middle">
								<table className="w-full min-w-full">
									<thead>
										<tr className="text-left">
											<th className="pr-4 pb-2 pl-4 font-medium text-lg">
												Year
											</th>
											<th className="pr-4 pb-2 font-medium text-lg">Race</th>
											<th className="pr-4 pb-2 font-medium text-lg">Result</th>
											<th className="whitespace-nowrap pr-4 pb-2 font-medium text-lg">
												Vote Share
											</th>
											<th className="pr-4 pb-2 font-medium text-lg">
												Opponents
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-4">
										{data.elections.map((election) => {
											const candidate = election.candidates.find(
												(c) => c.id === data.id,
											);

											if (!candidate) return null;

											const date = new Date(election.date);

											const isStateRace = election.type.includes("State");
											const stateRace = `${election.type} D-${election.district}`;

											const isWinner = election.winner.id === data.id;

											const voteSharePercent = formatPercentage({
												number:
													(candidate.voteShare / election.totalVotes) * 100,
											});

											const opponents = election.candidates
												.filter((c) => c.id !== data.id)
												.sort((a, b) => a.voteShare - b.voteShare);

											return (
												<tr key={election.id}>
													<td className="whitespace-nowrap py-2 pr-3 pl-4 align-text-top">
														{date.getFullYear()}
													</td>
													<td className="whitespace-nowrap py-2 pr-3 align-text-top">
														{isStateRace ? stateRace : election.type}
													</td>
													{isWinner ? (
														<td className="whitespace-nowrap py-2 pr-3 align-text-top">
															Won
														</td>
													) : (
														<td className="whitespace-nowrap py-2 pr-3 align-text-top">
															Lost
														</td>
													)}
													<td className="whitespace-nowrap py-2 pr-3 align-text-top">
														{voteSharePercent}%
													</td>
													<td className="py-2 pr-4 align-text-top">
														{opponents.map((opponent, index) => (
															<Link
																key={opponent.id}
																href={`/candidates/${opponent.id}`}
																className="w-full whitespace-nowrap pr-4 text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
															>
																{opponent.name}
																{index === opponents.length - 1 ? "" : <br />}
															</Link>
														))}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Suspense fallback={<div>Loading contributions...</div>}>
				<HydrateClient>
					<ContributionsTable candidateId={data.id} />
				</HydrateClient>
			</Suspense>
		</div>
	);
}
