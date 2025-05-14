"use client";

import { cn } from "@/app/_utils/cn";
import { navLinks } from "@/app/_utils/nav-links";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header
			className={cn([
				"sticky top-0 z-50 border-gray-4 border-b bg-white",
				mobileMenuOpen && "border-transparent",
			])}
		>
			<div className="mx-auto max-w-6xl px-4 py-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<img src="/favicon.svg" alt="Florida Elect" className="h-8 w-8" />
						<h1 className="font-bold text-xl">Florida Elect</h1>
					</Link>

					<div className="hidden items-center space-x-6 md:flex">
						<nav className="flex space-x-6">
							{navLinks.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									className="flex items-center space-x-1"
								>
									<item.icon className="h-4 w-4" />
									<span>{item.label}</span>
								</Link>
							))}
						</nav>
					</div>

					<button
						type="button"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<MenuIcon className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className="absolute top-16 left-0 w-full bg-white p-4 shadow-sm md:hidden">
						<nav className="flex flex-col space-y-4">
							{navLinks.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									className="flex items-center space-x-2 py-2"
								>
									<item.icon className="h-5 w-5" />
									<span>{item.label}</span>
								</Link>
							))}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
