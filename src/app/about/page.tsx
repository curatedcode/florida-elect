import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
};

export default function About() {
	return (
		<div className="pt-6 md:pt-10">
			<div className="mx-auto mb-4 w-fit">
				<h1 className="font-semibold text-xl">About</h1>
				<div>
					<p className="my-3">
						All data was sourced from government sources and is in no way a
						complete representation of the political landscape. The information
						provided should be used as a reference only.
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
