// Environment variable validation and access
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    logger.error('ENV', `Missing required environment variable: ${key}`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  logger.info('ENV', `Environment variable ${key} is set`);
  return value;
};

// Import logger
import { logger } from './utils/logger';

// Validate and export environment variables with consistent NEXT_PUBLIC_ prefix
export const ENV = {
  CDP_API_KEY: getEnvVar('NEXT_PUBLIC_CDP_API_KEY'),
  WALLET_CONNECT_PROJECT_ID: getEnvVar('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'),
  ALCHEMY_API_KEY: getEnvVar('NEXT_PUBLIC_ALCHEMY_API_KEY'),
} as const;

// Log environment configuration status (without values for security)
logger.info('ENV', 'Environment configuration loaded', {
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

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error('ENV', errorMessage);
    throw new Error(errorMessage);
  }

  return { isValid: true, missing: [] };
};
