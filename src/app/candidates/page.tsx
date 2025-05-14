import { CandidateCard } from "@/app/_components/candidate-card";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Candidates",
};

export default async function Candidates() {
	const data = await api.candidate.getAll();

	return (
		<div className="pt-6 md:pt-10">
			<div className="mx-auto mb-4 w-fit">
				<h1 className="font-semibold text-xl">All Candidates</h1>
				<div className="h-px bg-gray-4" />
			</div>
			<div className="flex flex-wrap justify-center gap-6">
				{data.map((candidate) => (
					<CandidateCard key={candidate.id} {...candidate} />
				))}
			</div>
		</div>
	);
}
