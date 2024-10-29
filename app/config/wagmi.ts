'use client';

import { http, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { base } from 'viem/chains';

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
console.log('[wagmi] Initializing with configuration:', {
  chainId: base.id,
  chainName: base.name,
  connectorCount: connectors.length,
  hasWalletConnect: Boolean(wcProjectId),
});

// Validate that we have at least one connector
if (connectors.length === 0) {
  console.error('[wagmi] No valid connectors available. Check environment variables and configuration.');
  throw new Error('No valid wallet connectors available');
}

// Create the wagmi config
let config;
try {
  config = createConfig({
    chains: [base],
    connectors,
    transports: {
      [base.id]: http(),
    },
  });

  // Log successful initialization
  console.log('[wagmi] Configuration initialized successfully');
} catch (error) {
  // Log detailed error information
  console.error('[wagmi] Failed to initialize configuration:', {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error,
    chainId: base.id,
    connectorCount: connectors.length
  });
  throw error;
}

// Export the config
export default config;

// Export a type for the config
export type WagmiConfig = typeof config;
