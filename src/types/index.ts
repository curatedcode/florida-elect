import { z } from "zod";

export const zElections = z.enum([
	"State Senate",
	"State House",
	"U.S. Senate",
	"U.S. House",
	"Governor",
	"President",
]);
export type zElections = z.infer<typeof zElections>;

export const politicalParties: {
	name: zPartyAbbreviation;
	label: zPartyName;
}[] = [
	{ name: "DEM", label: "Florida Democratic Party" },
	{ name: "REP", label: "Republican Party of Florida" },
	{ name: "ASP", label: "American Solidarity Party of Florida" },
	{ name: "BPP", label: "Boricua Party" },
	{ name: "CPP", label: "Coalition With A Purpose Party" },
	{ name: "CSV", label: "Conservative Party of Florida" },
	{ name: "CPF", label: "Constitution Party of Florida" },
	{ name: "ECO", label: "Ecology Party of Florida" },
	{ name: "FFP", label: "Florida Forward Party" },
	{ name: "GRE", label: "Green Party of Florida" },
	{ name: "IND", label: "Independent Party of Florida" },
	{ name: "JEF", label: "Jeffersonian Party of Florida" },
	{ name: "LPF", label: "Libertarian Party of Florida" },
	{ name: "MGT", label: "MGTOW Party" },
	{ name: "PSL", label: "Party for Socialism and Liberation - Florida" },
	{ name: "RFM", label: "Reform Party" },
	{ name: "NAT", label: "Florida Natural Law Party" },
	{ name: "NLP", label: "No Labels Party of Florida" },
	{ name: "PEO", label: "People's Party" },
	{ name: "WRI", label: "Write-in" },
	{ name: "UNK", label: "Unknown" },
];

export const zPartyAbbreviation = z.enum([
	"DEM",
	"REP",
	"ASP",
	"BPP",
	"CPP",
	"CSV",
	"CPF",
	"ECO",
	"FFP",
	"GRE",
	"IND",
	"JEF",
	"LPF",
	"MGT",
	"PSL",
	"RFM",
	"NAT",
	"NLP",
	"PEO",
	"WRI",
	"UNK",
]);
export type zPartyAbbreviation = z.infer<typeof zPartyAbbreviation>;

export const zPartyName = z.enum([
	"Florida Democratic Party",
	"Republican Party of Florida",
	"American Solidarity Party of Florida",
	"Boricua Party",
	"Coalition With A Purpose Party",
	"Conservative Party of Florida",
	"Constitution Party of Florida",
	"Ecology Party of Florida",
	"Florida Forward Party",
	"Green Party of Florida",
	"Independent Party of Florida",
	"Jeffersonian Party of Florida",
	"Libertarian Party of Florida",
	"MGTOW Party",
	"Party for Socialism and Liberation - Florida",
	"Reform Party",
	"Florida Natural Law Party",
	"No Labels Party of Florida",
	"People's Party",
	"Write-in",
	"Unknown",
]);
export type zPartyName = z.infer<typeof zPartyName>;

export const zPartyItem = z.object({
	name: zPartyAbbreviation,
	label: z.string(),
});
export type zPartyItem = z.infer<typeof zPartyItem>;

export const zContributorsSortBy = z.enum([
	"Name",
	"Name (Desc)",
	"Amount",
	"Amount (Desc)",
	"Earliest Date",
	"Earliest Date (Desc)",
	"Latest Date",
	"Latest Date (Desc)",
	"Count",
	"Count (Desc)",
]);
export type zContributorsSortBy = z.infer<typeof zContributorsSortBy>;
