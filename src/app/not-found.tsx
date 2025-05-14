import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404",
};

export default function NotFound() {
	return (
		<div className="w-full pt-48">
			<div className="mx-auto mb-4 grid w-fit place-items-center gap-6">
				<h1 className="font-semibold text-xl">Not Found</h1>
				<div className="max-w-sm text-center">
					<p>Could not find requested resource.</p>
					<p>Please check your URL and try again.</p>
				</div>
				<Link
					href="/"
					className="text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}
