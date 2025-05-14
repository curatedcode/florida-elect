"use client";

import { cn } from "@/app/_utils/cn";
import {
	FloatingPortal,
	type Placement,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useMergeRefs,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import {
	cloneElement,
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useMemo,
	useState,
} from "react";

interface TooltipOptions {
	initialOpen?: boolean;
	placement?: Placement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
	initialOpen = false,
	placement = "top",
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;

	const data = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip({
				crossAxis: placement.includes("-"),
				fallbackAxisSideDirection: "start",
				padding: 5,
			}),
			shift({ padding: 5 }),
		],
	});

	const context = data.context;

	const hover = useHover(context, {
		move: true,
		enabled: controlledOpen == null,
		delay: {
			open: 0,
			close: 150,
		},
	});
	const focus = useFocus(context, {
		enabled: controlledOpen == null,
	});
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });

	const interactions = useInteractions([hover, focus, dismiss, role]);

	const { isMounted, styles } = useTransitionStyles(context, {
		duration: {
			open: 150,
			close: 50,
		},
	});

	return useMemo(
		() => ({
			isMounted,
			setOpen,
			transitionStyles: styles,
			...interactions,
			...data,
		}),
		[isMounted, styles, setOpen, interactions, data],
	);
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

const useTooltipContext = () => {
	const context = useContext(TooltipContext);

	if (context == null) {
		throw new Error("Tooltip components must be wrapped in <Tooltip />");
	}

	return context;
};

export function Tooltip({
	children,
	...options
}: { children: React.ReactNode } & TooltipOptions) {
	const tooltip = useTooltip(options);
	return (
		<TooltipContext.Provider value={tooltip}>
			{children}
		</TooltipContext.Provider>
	);
}

export const TooltipTrigger = forwardRef<
	HTMLElement,
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
	const context = useTooltipContext();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const childrenRef = (children as any).ref;
	const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

	if (asChild && isValidElement(children)) {
		const childProps = children.props as { [key: string | number]: unknown };
		const restProps = {
			ref,
			"data-state": context.isMounted ? "open" : "closed",
			...props,
			...childProps,
		};

		return cloneElement(children, context.getReferenceProps(restProps));
	}

	return (
		<button
			ref={ref}
			data-state={context.isMounted ? "open" : "closed"}
			{...context.getReferenceProps(props)}
		>
			{children}
		</button>
	);
});

export const TooltipContent = forwardRef<
	HTMLDivElement,
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function TooltipContent({ style, className, ...props }, propRef) {
	const context = useTooltipContext();
	const ref = useMergeRefs([context.refs.setFloating, propRef]);

	if (!context.isMounted) return null;

	return (
		<FloatingPortal>
			<div
				ref={ref}
				style={{
					...context.floatingStyles,
				}}
			>
				<div
					style={{ ...style, ...context.transitionStyles }}
					className={cn([
						"rounded-sm border border-gray-4 bg-white px-1.5 py-0.5 text-sm shadow-sm",
						className,
					])}
					{...context.getFloatingProps(props)}
				/>
			</div>
		</FloatingPortal>
	);
});
