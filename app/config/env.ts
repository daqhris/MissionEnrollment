// Environment variable validation and access
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[ENV] Missing environment variable: ${key}`);
    return ''; // Return empty string instead of throwing
  }
  console.log(`[ENV] Environment variable ${key} is set`);
  return value;
};

// Validate and export environment variables with consistent NEXT_PUBLIC_ prefix
export const ENV = {
  CDP_API_KEY: getEnvVar('NEXT_PUBLIC_CDP_API_KEY'),
  WALLET_CONNECT_PROJECT_ID: getEnvVar('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'),
  ALCHEMY_API_KEY: getEnvVar('NEXT_PUBLIC_ALCHEMY_API_KEY'),
} as const;

// Log environment configuration status
console.log('[ENV] Environment configuration loaded:', {
  hasCdpKey: !!ENV.CDP_API_KEY,
  hasWalletConnectId: !!ENV.WALLET_CONNECT_PROJECT_ID,
  hasAlchemyKey: !!ENV.ALCHEMY_API_KEY,
});

// Export a function to check if all required variables are present
export const checkRequiredEnvVars = () => {
  const missing = [];
  if (!ENV.CDP_API_KEY) missing.push('NEXT_PUBLIC_CDP_API_KEY');
  if (!ENV.WALLET_CONNECT_PROJECT_ID) missing.push('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
  if (!ENV.ALCHEMY_API_KEY) missing.push('NEXT_PUBLIC_ALCHEMY_API_KEY');
  return { isValid: missing.length === 0, missing };
};
