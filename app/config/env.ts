// Import logger
import { logger } from '../utils/logger';

// Environment variable types
type EnvVar = string | undefined;
type RequiredEnvVar = string;

// Environment variable validation and access
const getEnvVar = (key: string, required: boolean = true, fallback?: string): RequiredEnvVar | EnvVar => {
  const value = process.env[key];

  if (!value) {
    if (required) {
      logger.error('ENV', `Missing required environment variable: ${key}`);
      throw new Error(`Missing required environment variable: ${key}`);
    }

    if (fallback !== undefined) {
      logger.warn('ENV', `Using fallback value for ${key}`);
      return fallback;
    }

    return undefined;
  }

  // Log presence without exposing values
  logger.info('ENV', `Environment variable ${key} is present`);
  return value;
};

// Validate and export environment variables with consistent NEXT_PUBLIC_ prefix
export const ENV = {
  CDP_API_KEY: getEnvVar('NEXT_PUBLIC_CDP_API_KEY', true) as RequiredEnvVar,
  WALLET_CONNECT_PROJECT_ID: getEnvVar('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', true) as RequiredEnvVar,
  ALCHEMY_API_KEY: getEnvVar('NEXT_PUBLIC_ALCHEMY_API_KEY', true) as RequiredEnvVar,
} as const;

// Log environment configuration status (without values for security)
logger.info('ENV', 'Environment configuration status', {
  variables: {
    CDP_API_KEY: !!ENV.CDP_API_KEY,
    WALLET_CONNECT_PROJECT_ID: !!ENV.WALLET_CONNECT_PROJECT_ID,
    ALCHEMY_API_KEY: !!ENV.ALCHEMY_API_KEY,
  }
});

// Export a function to check if all required variables are present
export const checkRequiredEnvVars = () => {
  const missing: string[] = [];

  // Check each required variable
  Object.entries({
    'NEXT_PUBLIC_CDP_API_KEY': ENV.CDP_API_KEY,
    'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID': ENV.WALLET_CONNECT_PROJECT_ID,
    'NEXT_PUBLIC_ALCHEMY_API_KEY': ENV.ALCHEMY_API_KEY,
  }).forEach(([key, value]) => {
    if (!value) missing.push(key);
  });

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error('ENV', errorMessage);
    throw new Error(errorMessage);
  }

  return { isValid: true, missing };
};
