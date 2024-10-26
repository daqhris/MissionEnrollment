'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import { base } from 'viem/chains';

// Environment variables are handled through next.config.js
const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export function useWagmiConfig() {
  const projectId = NEXT_PUBLIC_WC_PROJECT_ID ?? '';

  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'Mission Enrollment',
        projectId,
      },
    );

    const wagmiConfig = createConfig({
      chains: [base],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [base.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}

// Export chain IDs for easy reference
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: base.id, // 8453
};

export const DEFAULT_CHAIN = base;
