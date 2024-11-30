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
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Handle source map files
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
      include: /node_modules\/@metamask\/sdk/,
    });

    // Ignore TypeScript declaration map files
    config.module.rules.push({
      test: /\.d\.ts\.map$/,
      use: 'ignore-loader',
      include: /node_modules\/@metamask\/sdk/,
    });

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
