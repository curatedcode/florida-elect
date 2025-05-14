import { Aside } from "@/app/_components/aside";
import FloridaMap from "@/app/_components/florida-map";
import { MapProvider } from "@/app/_components/map-context";
import { api } from "@/trpc/server";
import type { zElections } from "@/types";
import { preparedMapDistricts, type zDistrictMapProperties } from "@/types/map";

export default async function Home() {
	const electionRaceType: zElections = "State Senate";

	const elections = await api.election.mapContextPrefetch({
		type: electionRaceType,
	});

	const merged = elections.map((election) => {
		const match = preparedMapDistricts.find(
			(d) => d.DISTRICT === election.districtNumber,
		);
		return {
			...election,
			district: match as zDistrictMapProperties,
		};
	});

	return (
		<MapProvider data={merged}>
			<div className="flex w-full flex-col lg:grid lg:grid-cols-3 lg:gap-6 lg:pt-12">
				<FloridaMap
					parties={merged.map((e) => ({
						number: e.district.DISTRICT,
						party: e.winner.party,
					}))}
				/>
				<Aside
					race={{ year: 2024, type: electionRaceType, state: "Florida" }}
				/>
			</div>
		</MapProvider>
	);
}
