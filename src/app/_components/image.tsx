"use client";

export interface ImageProps
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	fallBack?: string;
}

export function Image({ fallBack, onError, alt, ...props }: ImageProps) {
	function handleImgError(
		e: React.SyntheticEvent<HTMLImageElement, Event>,
		fallback?: string,
	) {
		console.log("Handling image error");
		if (onError) {
			onError(e);
		}
		if (!fallback) return;

		e.currentTarget.onerror = null;
		e.currentTarget.src = fallback;
	}

	return (
		// biome-ignore lint/a11y/useAltText: handled by user
		// biome-ignore lint/performance/noImgElement: Don't want to incur the Image element costs
		<img onError={(e) => handleImgError(e, fallBack)} {...props} />
	);
}
