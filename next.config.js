// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: ["api.poap.tech", "placehold.co", "assets.poap.xyz"],
  },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  output: 'export',
  basePath: process.env.GITHUB_PAGES === "true" && !process.env.CUSTOM_DOMAIN ? "/MissionEnrollment" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" && !process.env.CUSTOM_DOMAIN ? "/MissionEnrollment/" : "",
};

module.exports = nextConfig;
