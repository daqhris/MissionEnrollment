// Environment variable validation and access
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    throw new Error(`Environment variable ${key} is not set`);
  }
  console.log(`Environment variable ${key} is set`); // Log successful env var loading
  return value;
};

// Validate and export environment variables with consistent NEXT_PUBLIC_ prefix
export const ENV = {
  CDP_API_KEY: getEnvVar('NEXT_PUBLIC_CDP_API_KEY'),
  WALLET_CONNECT_PROJECT_ID: getEnvVar('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'),
  ALCHEMY_API_KEY: getEnvVar('NEXT_PUBLIC_ALCHEMY_API_KEY'),
} as const;

// Log environment configuration status
console.log('Environment configuration loaded:', {
  hasCdpKey: !!ENV.CDP_API_KEY,
  hasWalletConnectId: !!ENV.WALLET_CONNECT_PROJECT_ID,
  hasAlchemyKey: !!ENV.ALCHEMY_API_KEY,
});
