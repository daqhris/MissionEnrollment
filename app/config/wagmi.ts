'use client';
// typescript

import { http, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { base } from 'viem/chains';

interface WagmiConfigParams {
  alchemyApiKey: string;
  wcProjectId: string;
}

// Create a configuration factory function that accepts API keys
export function createWagmiConfig({ alchemyApiKey, wcProjectId }: WagmiConfigParams) {
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
      chains: [base]
    }),
    walletConnect({
      projectId: wcProjectId,
      showQrModal: true,
      chains: [base]
    }),
  ];

  console.log('Creating wagmi config with Base chain and connectors...');

  // Create the wagmi config with provided API keys
  const config = createConfig({
    chains: [base],
    connectors,
    transports: {
      [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    },
  });

  console.log('Wagmi config created successfully');
  return config;
}

// Export a type for the config
export type WagmiConfig = ReturnType<typeof createConfig>;
