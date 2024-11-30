'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID, NEXT_PUBLIC_ALCHEMY_API_KEY } from './env';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { baseMainnet, baseSepoliaChain } from './chains';

// Validate required environment variables during client-side execution
if (typeof window !== 'undefined') {
  if (!NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
  }

  if (!NEXT_PUBLIC_ALCHEMY_API_KEY) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required');
  }
}

// Create and export wagmi config using RainbowKit's getDefaultConfig
export const config = getDefaultConfig({
  appName: 'Mission Enrollment',
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [baseMainnet, baseSepoliaChain] as const,
  transports: {
    [baseMainnet.id]: http(`https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [baseSepoliaChain.id]: http(`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
  ssr: true,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        () => ({
          ...coinbaseWallet({ appName: 'Mission Enrollment' }),
          projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
        }),
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        () => injectedWallet(),
        () => metaMaskWallet({ projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '' }),
        () => walletConnectWallet({ projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '' }),
      ],
    },
  ],
});

// Export chain IDs for easy reference
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: baseMainnet.id,
  BASE_SEPOLIA: baseSepoliaChain.id,
} as const;

export const DEFAULT_CHAIN = baseMainnet;

// Export helper for network switching with type safety
export async function switchToNetwork(chainId: (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]) {
  if (typeof window === 'undefined' || !window.ethereum) {
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    console.error(`Failed to switch network: ${error}`);
  }
}

export { baseSepoliaChain };
