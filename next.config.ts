import type { NextConfig } from "next";
import "./src/env.js";

const nextConfig: NextConfig = {
	images: { unoptimized: true },
};

export default nextConfig;
