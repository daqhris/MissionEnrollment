module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/test/mocks/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/mocks/fileMock.js',
    '@coinbase/onchainkit/(.*)$': '<rootDir>/test/mocks/onchainKitMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        strict: true
      }
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@coinbase|@testing-library|wagmi|viem)/)'
  ],
  testTimeout: 10000,
  verbose: true
};
