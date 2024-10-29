import { type Config } from 'wagmi';

/**
 * Configuration interface for Wagmi client
 * @property isValid - Indicates if the configuration is valid and complete
 * @property hasError - Indicates if there was an error during configuration
 * @property error - Error object if an error occurred during configuration
 * @property config - Wagmi client configuration object
 */
export interface WagmiConfig {
  isValid: boolean;
  hasError?: boolean;
  error?: Error;
  config: Config;
}
