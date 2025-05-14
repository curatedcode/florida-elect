import { cn } from "@/app/_utils/cn";
import { formatPercentage } from "@/app/_utils/format-percentage";

export type DistributionPillProps = {
	values: {
		/**
		 * User friendly label for the value.
		 */
		label: string;
		/**
		 * The value.
		 */
		value: number;
		/**
		 * CSS variable name for the color.
		 */
		colorVariable: string;
	}[];
	/**
	 * The value will only be displayed if it is above this percentage.
	 *
	 * Defaults to `1`.
	 */
	hideValuesUnderPercent?: number;
	className?: string;
};

export function DistributionPill({
	values,
	hideValuesUnderPercent = 1,
	className,
}: DistributionPillProps) {
	const total = values.reduce((acc, val) => acc + val.value, 0);
	const percentages = values.map((val) => ({
		...val,
		percentage: (val.value / total) * 100,
	}));
	const visibleValues = percentages.filter(
		(val) => val.percentage > hideValuesUnderPercent,
	);

	return (
		<div
			className={cn([
				"flex h-8 gap-0.5 overflow-hidden rounded-full text-sm text-white",
				className,
			])}
		>
			{visibleValues.map((val) => {
				const fixedPercent = formatPercentage({ number: val.percentage });
				return (
					<div
						key={val.label}
						style={{
							width: `${fixedPercent}%`,
							backgroundColor: `var(${val.colorVariable})`,
						}}
						className="flex items-center justify-center"
					>
						{fixedPercent}%
					</div>
				);
			})}
		</div>
	);
}
