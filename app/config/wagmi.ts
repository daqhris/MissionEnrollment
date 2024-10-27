'use client';

import { http, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { base } from 'viem/chains';

// Environment variables are handled through next.config.js
const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!NEXT_PUBLIC_WC_PROJECT_ID) {
  throw new Error(
    'To connect to all Wallets you need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable'
  );
}

// Configure connectors for the app
const connectors = [
  coinbaseWallet({
    appName: 'Mission Enrollment'
  }),
  walletConnect({
    projectId: NEXT_PUBLIC_WC_PROJECT_ID,
    showQrModal: true
  }),
];

// Create and export the wagmi config
export const config = createConfig({
  chains: [base],
  connectors,
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

// Export the base chain for reference
export const DEFAULT_CHAIN = base;
