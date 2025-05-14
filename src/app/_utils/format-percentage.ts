export type FormatPercentageArgs = {
	/**
	 * The number to format as a percentage.
	 */
	number: number;
	/**
	 * The number of decimal places to round the percentage to.
	 *
	 * Defaults to `1`.
	 */
	decimalPlaces?: number;
};

/**
 * Formats a number as a percentage. Removing the trailing zero(s) if they exist.
 *
 * @example
 * formatPercentage({ number: 5.004, decimalPlace: 2 }) // output 5
 */
export function formatPercentage({
	number,
	decimalPlaces = 1,
}: FormatPercentageArgs) {
	const rounded = number.toFixed(decimalPlaces);

	return rounded.replace(/\.?0+$/, "");
}
