import type { NextConfig } from "next";

const repoName = "Students.sa";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
    eslint: {
      // Don't fail the build on ESLint errors in CI (we lint separately)
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Allow production builds even if there are type errors
      ignoreBuildErrors: true,
    },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : "",
  },
};

export default nextConfig;
