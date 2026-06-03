import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If hosted on a subpath (e.g. username.github.io/repo), set BASE_PATH=/repo during build
  basePath: process.env.BASE_PATH || "",
};

export default nextConfig;
