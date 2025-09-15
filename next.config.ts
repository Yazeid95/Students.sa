import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Students.sa',
  assetPrefix: '/Students.sa/',
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
