'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { createConfig, http } from 'wagmi';
import { type Chain, base } from '@wagmi/chains';

// Define Base Sepolia chain following wagmi's chain structure
const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
    etherscan: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`,
      blockCreated: 1059647,
    },
  },
  testnet: true,
};

// Environment variables are handled through next.config.js
const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

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

    // Create wagmi config with properly typed chains array
    const config = createConfig({
      chains: [base, baseSepolia],
      transports: {
        [base.id]: http(
          NEXT_PUBLIC_ALCHEMY_API_KEY
            ? `https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
            : 'https://mainnet.base.org'
        ),
        [baseSepolia.id]: http(
          NEXT_PUBLIC_ALCHEMY_API_KEY
            ? `https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
            : 'https://sepolia.base.org'
        ),
      },
      connectors,
    });

    return config;
  }, [projectId]);
}

// Export chain IDs for easy reference
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: base.id, // 8453
  BASE_SEPOLIA: baseSepolia.id, // 84532
};

export const DEFAULT_CHAIN = base;
