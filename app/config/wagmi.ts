'use client';
// typescript

import { http, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { base } from 'viem/chains';

// Create wagmi config with environment variables
const alchemyApiKey = process.env.ALCHEMY_API_KEY || '';
const wcProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

console.log('Initializing wagmi config with Base chain...', {
  hasAlchemyKey: !!alchemyApiKey,
  hasWcProjectId: !!wcProjectId,
  chain: base.name,
  chainId: base.id
});

// Configure connectors for the app
const connectors = [
  coinbaseWallet({
    appName: 'Mission Enrollment',
    appLogoUrl: 'https://mission-enrollment.daqhris.com/favicon.ico',
    version: '4'
  }),
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
];

console.log('Creating wagmi config with Base chain and connectors...');

// Create and export the wagmi config
const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
  },
});

console.log('Wagmi config created successfully');

// Export the config
export default config;

// Export a type for the config
export type WagmiConfig = ReturnType<typeof createConfig>;
