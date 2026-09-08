import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If hosted on a subpath (e.g. username.github.io/E-Portfolio), set:
  //   BASE_PATH=/E-Portfolio             (used by Next.js router & link prefixing)
  //   NEXT_PUBLIC_BASE_PATH=/E-Portfolio (used by src/lib/basepath.ts for raw hrefs)
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.BASE_PATH || "",
};

export default nextConfig;
