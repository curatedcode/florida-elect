"use client";

import { DistributionPill } from "@/app/_components/distribution-pill";
import { useMapContext } from "@/app/_components/map-context";
import { cn } from "@/app/_utils/cn";
import { formatPercentage } from "@/app/_utils/format-percentage";
import type { zElections } from "@/types";
import type { zStates } from "@/types/map";
import Link from "next/link";
import type { z } from "zod";

export type AsideProps = {
	race: {
		year: number;
		type: z.infer<typeof zElections>;
		state?: z.infer<typeof zStates>;
	};
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export function Aside({ race, className, ...props }: AsideProps) {
	const { selectedDistrict } = useMapContext();

	function winnerFirstName() {
		if (!selectedDistrict) return "";
		const winnerNameSplit = selectedDistrict.winner.name.split(" ") as string[];
		return winnerNameSplit[winnerNameSplit.length - 1];
	}

	const partyVoteTotals = (() => {
		if (!selectedDistrict) return;

		let republicanPartyVotes = 0;

		let democratPartyVotes = 0;

		let thirdPartyVotes = 0;

		for (const candidate of selectedDistrict.candidates) {
			switch (candidate.party) {
				case "REP":
					republicanPartyVotes += candidate.voteShare;
					break;
				case "DEM":
					democratPartyVotes += candidate.voteShare;
					break;
				default:
					thirdPartyVotes += candidate.voteShare;
			}
		}

		return { republicanPartyVotes, democratPartyVotes, thirdPartyVotes };
	})();

	const totalVotes = partyVoteTotals
		? Object.values(partyVoteTotals).reduce((acc, votes) => acc + votes, 0)
		: 0;

	const ageRangePercentages = (() => {
		if (!selectedDistrict) return;

		const total =
			selectedDistrict.district["18 to 24 years"] +
			selectedDistrict.district["25 to 34 years"] +
			selectedDistrict.district["35 to 44 years"] +
			selectedDistrict.district["45 to 54 years"] +
			selectedDistrict.district["55 to 59 years"] +
			selectedDistrict.district["60 to 64 years"] +
			selectedDistrict.district["65 to 74 years"] +
			selectedDistrict.district["75 years and over"];

		return {
			"18 to 24 years": formatPercentage({
				number: (selectedDistrict.district["18 to 24 years"] / total) * 100,
			}),
			"25 to 34 years": formatPercentage({
				number: (selectedDistrict.district["25 to 34 years"] / total) * 100,
			}),
			"35 to 44 years": formatPercentage({
				number: (selectedDistrict.district["35 to 44 years"] / total) * 100,
			}),
			"45 to 54 years": formatPercentage({
				number: (selectedDistrict.district["45 to 54 years"] / total) * 100,
			}),
			"55 to 59 years": formatPercentage({
				number: (selectedDistrict.district["55 to 59 years"] / total) * 100,
			}),
			"60 to 64 years": formatPercentage({
				number: (selectedDistrict.district["60 to 64 years"] / total) * 100,
			}),
			"65 to 74 years": formatPercentage({
				number: (selectedDistrict.district["65 to 74 years"] / total) * 100,
			}),
			"75 years and over": formatPercentage({
				number: (selectedDistrict.district["75 years and over"] / total) * 100,
			}),
		};
	})();

	const sexPercentages = (() => {
		if (!selectedDistrict) return;

		const total =
			selectedDistrict.district.Male + selectedDistrict.district.Female;
		return {
			male: formatPercentage({
				number: (selectedDistrict.district.Male / total) * 100,
			}),
			female: formatPercentage({
				number: (selectedDistrict.district.Female / total) * 100,
			}),
		};
	})();

	return (
		<div
			{...props}
			className={cn([
				"mt-12 h-fit min-h-52 rounded-sm border border-gray-4 bg-white p-4 shadow-sm lg:mt-0",
				className,
			])}
		>
			<h2 className="mb-4 font-semibold text-xl">
				{race.state} {race.type} {race.year}
			</h2>
			{selectedDistrict ? (
				<div className="flex flex-col justify-center gap-6 px-2">
					<div>
						<h3 className="mb-2 w-fit border-gray-4 border-b px-1 font-medium text-lg">
							District {selectedDistrict.districtNumber}
						</h3>
						<div className="flex flex-col gap-2 px-1">
							<div className="flex gap-2">
								<div>Winner:</div>
								<div className="flex gap-2 font-medium">
									<Link
										href={`/candidates/${selectedDistrict.winner.id}`}
										className="text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
									>
										{winnerFirstName()}
									</Link>
									<div>({selectedDistrict.winner.party[0]?.toUpperCase()})</div>
								</div>
							</div>
							<DistributionPill
								values={
									partyVoteTotals
										? [
												{
													label: "Republican",
													value: partyVoteTotals.republicanPartyVotes,
													colorVariable: "--color-party-republican",
												},
												{
													label: "Democrat",
													value: partyVoteTotals.democratPartyVotes,
													colorVariable: "--color-party-democrat",
												},
												{
													label: "Alternative",
													value: partyVoteTotals.thirdPartyVotes,
													colorVariable: "--color-party-other",
												},
											]
										: []
								}
							/>
							<span className="mx-auto w-fit">
								{totalVotes.toLocaleString("en-US")} votes cast
							</span>
						</div>
					</div>
					<div>
						<h3 className="mb-2 w-fit border-gray-4 border-b px-1 font-medium text-lg">
							Demographics
						</h3>
						<div className="flex flex-col gap-2 px-1">
							{ageRangePercentages && (
								<div className="mb-1">
									<h4 className="mb-1 font-medium">Ages</h4>
									<div className="flex flex-col gap-2 px-1">
										<div className="flex gap-2">
											<div className="w-34">18 to 24 years: </div>
											<div>{ageRangePercentages["18 to 24 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">25 to 34 years:</div>
											<div>{ageRangePercentages["25 to 34 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">35 to 44 years:</div>
											<div>{ageRangePercentages["35 to 44 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">45 to 54 years:</div>
											<div>{ageRangePercentages["45 to 54 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">55 to 59 years:</div>
											<div>{ageRangePercentages["55 to 59 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">60 to 64 years:</div>
											<div>{ageRangePercentages["60 to 64 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">65 to 74 years:</div>
											<div>{ageRangePercentages["65 to 74 years"]}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-34">75 years and over:</div>
											<div>{ageRangePercentages["75 years and over"]}%</div>
										</div>
									</div>
								</div>
							)}
							{sexPercentages && (
								<div>
									<h4 className="mb-1 font-medium">Sex</h4>
									<div className="flex flex-col gap-2 px-1">
										<div className="flex gap-2">
											<div className="w-15">Male:</div>
											<div>{sexPercentages.male}%</div>
										</div>
										<div className="flex gap-2">
											<div className="w-15">Female:</div>
											<div>{sexPercentages.female}%</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="mt-6 px-2">
					<p className="rounded-sm border border-gray-4 border-dashed px-2 py-4 text-center text-gray-9">
						Select a county on the map to view detailed results.
					</p>
				</div>
			)}
		</div>
	);
}
