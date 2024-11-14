/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disabled for debugging
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'lib', 'app', 'hooks', 'utils'],
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: ["api.poap.tech", "placehold.co", "assets.poap.xyz", "ipfs.io"],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // Static export is compatible with Next.js 13+ dynamic routes
  output: 'export',
  basePath: process.env.CUSTOM_DOMAIN === "true" ? "" : process.env.GITHUB_PAGES === "true" ? "/MissionEnrollment" : "",
  assetPrefix: process.env.CUSTOM_DOMAIN === "true" ? "" : process.env.GITHUB_PAGES === "true" ? "/MissionEnrollment/" : "",
  // Ensure client-side rendering works properly
  trailingSlash: true,
};

module.exports = nextConfig;
