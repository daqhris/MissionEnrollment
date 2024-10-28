const webpack = require('webpack');

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
    '@tanstack/react-query'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false
    };

    // Handle BigInt serialization
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
                }
              }
            }]
          ],
          plugins: [
            '@babel/plugin-transform-modules-commonjs'
          ]
        }
      },
      include: [
        /node_modules\/@tanstack/,
        /node_modules\/colorette/,
        /node_modules\/fast-copy/
      ]
    });

    // Add environment variable for BigInt support
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_RUNTIME': JSON.stringify('nodejs')
      })
    );

    return config;
  }
};

module.exports = nextConfig;
