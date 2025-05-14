import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { TRPCReactProvider } from "@/trpc/react";

const geist = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s - Florida Elect",
		default: "Florida Elect",
	},
	description:
		"Track Florida elections with ease — explore real-time data by district, view candidates and their contributors, and get clear insights into races and campaign financing.",
	generator: "Next.js",
	applicationName: "Florida Elect",
	keywords: ["Election", "Florida", "Statistics"],
	creator: "Zackary Fotheringham",
	publisher: "Zackary Fotheringham",
	openGraph: {
		title: "Florida Elect",
		description:
			"Track Florida elections with ease — explore real-time data by district, view candidates and their contributors, and get clear insights into races and campaign financing.",
		url: "https://florida-elect.vercel.app",
		siteName: "Florida Elect",
		images: [
			{
				url: "https://florida-elect.vercel.app/og.png",
				width: 800,
				height: 600,
			},
		],
		locale: "en_US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
		},
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
		other: [
			{
				rel: "apple-touch-icon-precomposed",
				url: "/apple-touch-icon-precomposed.png",
			},
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon-120.png",
				sizes: "120x120",
			},
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon-152.png",
				sizes: "152x152",
			},
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon-167.png",
				sizes: "167x167",
			},
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon-180.png",
				sizes: "180x180",
			},
		],
	},
	manifest: "/manifest.json",
	twitter: {
		card: "summary_large_image",
		title: "Florida Elect",
		description:
			"Track Florida elections with ease — explore real-time data by district, view candidates and their contributors, and get clear insights into races and campaign financing.",
		siteId: "722408900213874688",
		creator: "@IamNotZack",
		creatorId: "722408900213874688",
		images: ["https://florida-elect.vercel.app/og.png"],
	},
	category: "Elections",
	pinterest: {
		richPin: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={geist.variable}>
			<TRPCReactProvider>
				<body className="bg-background text-gray-12 antialiased">
					<Header />
					<div className="mx-auto min-h-[85vh] max-w-6xl px-4">{children}</div>
					<Footer />
				</body>
			</TRPCReactProvider>
		</html>
	);
}
