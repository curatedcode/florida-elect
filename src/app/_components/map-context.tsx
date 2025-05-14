"use client";
import type { api } from "@/trpc/server";
import type { zDistrictMapProperties } from "@/types/map";
import { createContext, useContext, useMemo, useState } from "react";

type ElementType<T> = T extends (infer U)[] ? U : T;
type Election = ElementType<
	Awaited<ReturnType<typeof api.election.mapContextPrefetch>>
>;

export type District = Election & {
	district: zDistrictMapProperties;
};

export type MapContextType = {
	selectedDistrict: District | undefined;
	selectedDistrictNumber: number | undefined;
	setSelectedDistrictNumber: React.Dispatch<
		React.SetStateAction<number | undefined>
	>;
};

export const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
	const context = useContext(MapContext);

	if (!context) {
		throw new Error(
			"useMapContext is null. Make sure component is wrapped in <MapProvider />",
		);
	}

	return context;
};

export function MapProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: District[];
}) {
	const [selectedDistrictNumber, setSelectedDistrictNumber] =
		useState<number>();

	const selectedDistrict = useMemo(
		() => data.find((d) => d.districtNumber === selectedDistrictNumber),
		[selectedDistrictNumber, data],
	);

	return (
		<MapContext.Provider
			value={{
				selectedDistrict,
				selectedDistrictNumber,
				setSelectedDistrictNumber,
			}}
		>
			{children}
		</MapContext.Provider>
	);
}
