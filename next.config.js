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
    '@walletconnect/types',
    '@walletconnect/core',
    '@walletconnect/sign-client',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider',
    'query-string',
    '@wagmi/connectors',
    '@rainbow-me/rainbowkit'
  ],
  webpack: (config) => {
    // Add loader for handling BigInt serialization
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            function () {
              return {
                visitor: {
                  CallExpression(path) {
                    if (path.node.callee.name === 'BigInt') {
                      const valueNode = path.node.arguments[0];
                      if (valueNode.type === 'NumericLiteral' || valueNode.type === 'StringLiteral') {
                        const strValue = valueNode.value.toString();
                        const isNegative = strValue.startsWith('-');
                        const absStr = strValue.replace('-', '');

                        // Check if the number exceeds safe integer bounds based on string length
                        const MAX_SAFE_LENGTH = Number.MAX_SAFE_INTEGER.toString().length;
                        if (absStr.length > MAX_SAFE_LENGTH) {
                          path.replaceWith({
                            type: 'NumericLiteral',
                            value: isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
                          });
                        } else {
                          // For numbers within safe bounds, we can safely use parseInt
                          const parsed = parseInt(absStr, 10);
                          if (parsed > Number.MAX_SAFE_INTEGER) {
                            path.replaceWith({
                              type: 'NumericLiteral',
                              value: isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
                            });
                          } else {
                            path.replaceWith({
                              type: 'NumericLiteral',
                              value: isNegative ? -parsed : parsed
                            });
                          }
                        }
                      }
                    }
                  }
                }
              };
            }
          ]
        }
      },
      exclude: /node_modules/
    });

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
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url')
    };
    config.resolve.alias = {
      ...config.resolve.alias
    };
    config.resolve.modules = [
      'node_modules',
      ...config.resolve.modules || []
    ];
    return config;
  }
};

module.exports = nextConfig;
