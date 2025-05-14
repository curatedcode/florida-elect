import { cn } from "@/app/_utils/cn";
import { type VariantProps, cva } from "class-variance-authority";

const buttonCva = cva(
	"inline-flex items-center justify-center rounded-sm font-medium text-sm leading-5 transition-colors focus-visible:outline-1 focus-visible:outline-accent-8 disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			size: {
				default: "h-8 px-3",
				icon: "size-8",
			},
			variant: {
				classic:
					"relative z-0 bg-accent-9 bg-gradient-btn-classic text-accent-contrast shadow-btn-classic transition-all active:bg-linear-[var(--black-a1),#0000] active:pt-0.5 active:shadow-btn-classic-active",
				solid:
					"bg-accent-9 text-accent-contrast transition hover:bg-accent-10 active:brightness-solid-active active:saturate-solid-active",
				soft: "bg-accent-a3 text-accent-a11 hover:bg-accent-a4 active:bg-accent-a5",
				surface:
					"bg-accent-surface text-accent-a11 ring ring-accent-a7 ring-inset hover:ring-accent-a8 active:bg-accent-a3 active:ring-accent-a8",
				outline:
					"text-accent-a11 ring ring-accent-a8 ring-inset hover:bg-accent-a2 active:bg-accent-a3",
				ghost: "text-accent-a11 hover:bg-accent-a3 active:bg-accent-a4",
				destructive:
					"bg-red-500 text-accent-contrast hover:bg-red-500/90 active:bg-red-600",
			},
		},
		defaultVariants: {
			variant: "solid",
			size: "default",
		},
	},
);

export const buttonVariants = (
	props?: VariantProps<typeof buttonCva> & { class?: string },
) => {
	const { class: className, ...variantProps } = props || {};
	return cn([buttonCva(variantProps), className]);
};

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	ButtonVariantProps;

export function Button({
	className,
	type = "button",
	variant,
	size,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={buttonVariants({ variant, size, class: className })}
			{...props}
		>
			{children}
		</button>
	);
}
