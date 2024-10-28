javascript
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
                        // Handle large numbers safely without using Math.pow
                        if (strValue.length > 16) {
                          path.replaceWith({
                            type: 'NumericLiteral',
                            value: Number.MAX_SAFE_INTEGER
                          });
                        } else {
                          // Process digits individually to avoid Math.pow
                          let result = 0;
                          const digits = strValue.replace(/[^0-9]/g, '').split('');
                          for (let i = 0; i < digits.length; i++) {
                            const digit = parseInt(digits[i], 10);
                            if (!isNaN(digit)) {
                              let multiplier = 1;
                              for (let j = 0; j < digits.length - i - 1; j++) {
                                if (multiplier > Number.MAX_SAFE_INTEGER / 10) {
                                  result = Number.MAX_SAFE_INTEGER;
                                  break;
                                }
                                multiplier *= 10;
                              }
                              if (result <= Number.MAX_SAFE_INTEGER - digit * multiplier) {
                                result += digit * multiplier;
                              } else {
                                result = Number.MAX_SAFE_INTEGER;
                                break;
                              }
                            }
                          }
                          path.replaceWith({
                            type: 'NumericLiteral',
                            value: result
                          });
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
