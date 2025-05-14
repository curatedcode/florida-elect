import { Image } from "@/app/_components/image";
import { cn } from "@/app/_utils/cn";
import { getPartyLabel } from "@/app/_utils/get-party-label";
import type { zPartyAbbreviation } from "@/types";
import Link from "next/link";

export type CandidateCardProps = {
	id: number;
	party: zPartyAbbreviation;
	image: string;
	name: string;
	resultCount: number;
};

export function CandidateCard({ id, party, image, name }: CandidateCardProps) {
	return (
		<Link
			key={id}
			href={`/candidates/${id}`}
			className={cn([
				"flex h-22 w-80 items-center gap-2 rounded-md border border-gray-4 border-l-4 bg-white px-3 py-1.5 shadow-sm transition hover:border-gray-6 hover:shadow-md",
				party === "REP" &&
					"border-l-party-republican hover:border-l-party-republican",
				party === "DEM" &&
					"border-l-party-democrat hover:border-l-party-democrat",
				party !== "REP" &&
					party !== "DEM" &&
					"border-l-party-other hover:border-l-party-other",
			])}
		>
			<Image
				src={`/images/candidates/${image}.webp`}
				alt={`${name} headshot`}
				className="size-16 rounded-full object-cover"
				fallBack="/images/placeholder.webp"
			/>
			<div className="truncate">
				<h2 className="w-full truncate font-semibold text-lg">{name}</h2>
				<div className="w-full truncate text-gray-10">
					{getPartyLabel(party)}
				</div>
			</div>
		</Link>
	);
}
