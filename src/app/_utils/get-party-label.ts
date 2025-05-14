import { politicalParties, type zPartyAbbreviation } from "@/types";

export function getPartyLabel(partyName: zPartyAbbreviation) {
	const party = politicalParties.find((p) => p.name === partyName);

	if (!party) {
		throw new Error(`Unknown party name: ${partyName}`);
	}

	return party.label;
}
