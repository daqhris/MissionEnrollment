// @ts-check

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
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      'process/browser': false,
    };

    // Handle module resolution
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle ES modules
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['next/babel', {
              'preset-env': {
                targets: {
                  node: 'current'
                },
                modules: false
              }
            }]
          ]
        }
      },
      include: [
        /node_modules\/@tanstack/,
        /node_modules\/colorette/,
        /node_modules\/fast-copy/,
        /node_modules\/@coinbase/,
        /node_modules\/wagmi/,
        /node_modules\/react/,
        /node_modules\/react-dom/
      ]
    });

    return config;
  }
};

module.exports = nextConfig;
