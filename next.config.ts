import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/iosdh-nav",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
