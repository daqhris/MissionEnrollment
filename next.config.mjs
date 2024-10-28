/** @type {import('next').NextConfig} */
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
    'wagmi'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false
    };
    // Add support for BigInt serialization
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            ['@babel/plugin-proposal-numeric-separator'],
            ['@babel/plugin-syntax-bigint']
          ]
        }
      }
    });
    return config;
  }
};

export default nextConfig;
