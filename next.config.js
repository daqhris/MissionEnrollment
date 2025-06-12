/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disabled for debugging
  typescript: {
    ignoreBuildErrors: true, // Temporarily disabled for testing static export
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'lib', 'app', 'hooks', 'utils'],
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Skip parsing of problematic MetaMask SDK files
    config.module.noParse = [
      /\.(map|d\.ts|d\.ts\.map)$/,
      /node_modules\/@metamask\/sdk\/.*\.(js|ts|map)$/
    ];

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
  output: process.env.GITHUB_PAGES === "true" ? 'export' : undefined,
  basePath: process.env.CUSTOM_DOMAIN === "true" ? "" : process.env.GITHUB_PAGES === "true" ? "/MissionEnrollment" : "",
  assetPrefix: process.env.CUSTOM_DOMAIN === "true" ? "" : process.env.GITHUB_PAGES === "true" ? "/MissionEnrollment/" : "",
  // Ensure client-side rendering works properly
  trailingSlash: process.env.GITHUB_PAGES === "true" ? true : false,
};

module.exports = nextConfig;
