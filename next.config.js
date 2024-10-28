// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["api.poap.tech", "placehold.co", "assets.poap.xyz"],
  },
  output: 'standalone',
  transpilePackages: [
    'colorette',
    'fast-copy',
    'pino-pretty',
    'pino',
    '@walletconnect/utils',
    'query-string'
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.cjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      querystring: require.resolve('querystring-es3'),
    };
    return config;
  }
};

module.exports = nextConfig;
