import { navLinks } from "@/app/_utils/nav-links";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="mt-24 border-gray-4 border-t bg-white py-6">
			<div className="mx-auto max-w-6xl px-4">
				<div className="text-center">
					<div className="mx-auto mb-3 grid w-fit gap-3 border-gray-4 border-b px-1 pb-2 md:flex md:gap-6">
						{navLinks.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="text-accent-10 text-sm underline underline-offset-2 transition-colors hover:text-accent-12"
							>
								{item.label}
							</Link>
						))}
					</div>
					<p className="mt-1 text-xs">
						© {new Date().getFullYear()} Florida Elect
					</p>
				</div>
			</div>
		</footer>
	);
}
