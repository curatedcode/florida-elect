import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404",
};

export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link
				href="/"
				className="text-accent-10 underline underline-offset-2 transition-colors hover:text-accent-12"
			>
				Return Home
			</Link>
		</div>
	);
}
