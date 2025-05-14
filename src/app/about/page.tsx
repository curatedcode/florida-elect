import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
};

export default function About() {
	return (
		<div className="pt-8 md:pt-16">
			<div className="mx-auto mb-4 grid place-items-center gap-6">
				<h1 className="font-semibold text-xl">About</h1>
				<div className="justify-self-center">
					<p className="my-3 max-w-md">
						All data is sourced from official government records and is intended
						for reference purposes only. Please note that it does not represent
						a comprehensive view of the political landscape.
					</p>
					<div className="flex flex-col gap-2">
						<a
							href="https://ccmedia.fdacs.gov/content/download/2936/file/County_FIPSNo_CountyNo.pdf"
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							County Codes
						</a>
						<a
							href="https://results.elections.myflorida.com/Index.asp?ElectionDate=8/20/2024&DATAMODE="
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							Election Results
						</a>
						<a
							href="https://dos.elections.myflorida.com/campaign-finance/contributions/"
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							Candidate Contribution Records
						</a>
						<a
							href="https://dos.elections.myflorida.com/campaign-finance/expenditures/"
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							Candidate Expenditures
						</a>
						<a
							href="https://www.flsenate.gov/Session/Redistricting/MapsAndStats"
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							Senate Districts
						</a>
						<a
							href="https://data.census.gov/table/ACSDP5Y2022.DP05?q=Age+and+Sex&g=040XX00US12,12$1400000"
							target="_blank"
							rel="noreferrer"
							className="w-fit text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
						>
							Census Demographic Data
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
