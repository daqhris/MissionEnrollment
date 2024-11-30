'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'viem/chains';
import { http } from 'viem';
import { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID, NEXT_PUBLIC_ALCHEMY_API_KEY } from './env';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

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
  chains: [base, baseSepolia] as const,
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
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
  BASE_MAINNET: base.id, // 8453
  BASE_SEPOLIA: baseSepolia.id, // 84532
};

export const DEFAULT_CHAIN = base;

// Export helper for network switching
export async function switchToNetwork(chainId: number) {
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

export { baseSepolia };
