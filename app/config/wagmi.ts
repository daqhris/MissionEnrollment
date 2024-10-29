'use client';

import { http, createConfig, Config } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { base } from 'viem/chains';
import { logger } from '../utils/logger';

// Create wagmi config with environment variables
const wcProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// Validate required environment variables
if (!wcProjectId) {
  console.error('[wagmi] Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable');
}

// Configure connectors for the app
const connectors = [
  coinbaseWallet({
    appName: 'Mission Enrollment',
    appLogoUrl: 'https://mission-enrollment.daqhris.com/favicon.ico',
    version: '4'
  }),
  ...(wcProjectId ? [
    walletConnect({
      projectId: wcProjectId,
      showQrModal: true,
      metadata: {
        name: 'Mission Enrollment',
        description: 'Mission Enrollment dApp',
        url: 'https://mission-enrollment.daqhris.com',
        icons: ['https://mission-enrollment.daqhris.com/favicon.ico']
      }
    })
  ] : [])
].filter(Boolean);

// Log configuration status
logger.info('wagmi', 'Initializing configuration', {
  chainId: base.id,
  chainName: base.name,
  connectorCount: connectors.length,
  hasWalletConnect: Boolean(wcProjectId),
});

// Validate that we have at least one connector
if (connectors.length === 0) {
  logger.warn('wagmi', 'No valid connectors available. Using fallback configuration.');
}

// Create the wagmi config
let config: Config;
let initializationError: Error | null = null;
let isValid = false;

try {
  // Verify required environment variables
  if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
    throw new Error('CDP API key is not configured');
  }

  config = createConfig({
    chains: [base],
    connectors: connectors.length > 0 ? connectors : [
      // Fallback connector configuration
      coinbaseWallet({
        appName: 'Mission Enrollment',
        appLogoUrl: 'https://mission-enrollment.daqhris.com/favicon.ico',
        version: '4'
      })
    ],
    transports: {
      [base.id]: http(),
    },
  });

  // Verify the configuration is valid
  if (!config.chains || config.chains.length === 0) {
    throw new Error('Invalid configuration: No chains configured');
  }

  isValid = true;
  logger.info('wagmi', 'Configuration initialized successfully');
} catch (error) {
  // Log detailed error information
  logger.error('wagmi', 'Failed to initialize configuration', {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error,
    chainId: base.id,
    connectorCount: connectors.length
  });
  initializationError = error instanceof Error ? error : new Error('Failed to initialize wagmi configuration');

  // Create minimal fallback config
  config = createConfig({
    chains: [base],
    connectors: [],
    transports: {
      [base.id]: http(),
    },
  });
}

// Export the config and initialization status
export default {
  config,
  hasError: !!initializationError,
  error: initializationError,
  isValid
};

// Export a type for the config
export type WagmiConfig = typeof config;
