"use client";
import { useMapContext } from "@/app/_components/map-context";
import { cn } from "@/app/_utils/cn";
import type { zPartyAbbreviation } from "@/types";
import type {
	zDistrictMap,
	zDistrictMapProperties,
	zMapNames,
} from "@/types/map";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";

export type FloridaMapProps = {
	/**
	 * The name of the map to render.
	 *
	 * Defaults to `"2022-2032"`.
	 */
	mapName?: zMapNames;
	/**
	 * Districts parties.
	 */
	parties: { number: number; party: zPartyAbbreviation }[];
	className?: string;
};

export default function FloridaMap({
	mapName = "2022-2032",
	parties,
	className,
}: FloridaMapProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const { setSelectedDistrictNumber } = useMapContext();

	function getDistrictParty(districtNumber: number) {
		return parties.find((p) => p.number === districtNumber)?.party;
	}

	function getPartyColor(districtNumber: number) {
		const party = getDistrictParty(districtNumber);
		if (!party) return "#d4d4d4";

		const colorVariable =
			party === "REP"
				? "var(--color-party-republican)"
				: party === "DEM"
					? "var(--color-party-democrat)"
					: "var(--color-party-other)";

		return colorVariable;
	}

	const width = 800;
	const height = 550;

	// biome-ignore lint/correctness/useExhaustiveDependencies: getPartyColor changes on every re-render and should not be used as a hook dependency.
	useEffect(() => {
		const svg = d3
			.select(svgRef.current)
			.attr("viewBox", `0 0 ${width} ${height}`);

		const projection = d3.geoAlbers().scale(1).translate([0, 0]);

		const path = d3.geoPath().projection(projection);

		d3.json(`/shapefiles/${mapName}.json`).then((topoData) => {
			const data = topoData as unknown as zDistrictMap;

			const geojson = feature(data, data.objects.data);

			projection.fitExtent(
				[
					[0, 0],
					[width, height],
				],
				geojson,
			);

			type dType = { properties: zDistrictMapProperties };

			svg
				.selectAll("path")
				.data(geojson.features)
				.join("path")
				.attr("d", path)
				.attr("fill", (d: dType) => getPartyColor(d.properties.DISTRICT))
				.attr("stroke", "var(--color-background)")
				.style("transition", "opacity 150ms ease")
				.style("opacity", (d: dType) => {
					const color = getPartyColor(d.properties.DISTRICT);

					if (color === "#d4d4d4") return "100%";
					return "85%";
				})
				.on("mouseover", function (_, _d: dType) {
					d3.select(this).style("opacity", "100%");
				})
				.on("mouseout", function (_, d: dType) {
					const color = getPartyColor(d.properties.DISTRICT);

					d3.select(this).style(
						"opacity",
						color === "#d4d4d4" ? "100%" : "85%",
					);
				})
				.on("click", (_, d: { properties: zDistrictMapProperties }) =>
					setSelectedDistrictNumber(d.properties.DISTRICT),
				);
		});
	}, [mapName, parties, setSelectedDistrictNumber]);

	return (
		<svg
			ref={svgRef}
			className={cn(["col-span-2 mt-12 h-fit w-full lg:ml-0", className])}
			width={width}
			height={height}
			preserveAspectRatio="xMidYMid meet"
		/>
	);
}
