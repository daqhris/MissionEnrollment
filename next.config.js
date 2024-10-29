// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["api.poap.tech", "placehold.co", "assets.poap.xyz"],
    unoptimized: true,
  },
  output: 'export',
  transpilePackages: [
    '@walletconnect/utils',
    '@walletconnect/types',
    '@walletconnect/core',
    '@walletconnect/sign-client',
    'query-string',
    'viem',
    'wagmi',
    '@tanstack/query-core',
    '@tanstack/react-query',
    '@coinbase/onchainkit',
    'react-error-boundary',
    'react',
    'react-dom'
  ],
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  }
};

module.exports = nextConfig;
