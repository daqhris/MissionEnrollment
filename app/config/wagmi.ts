'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { http } from 'viem';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!NEXT_PUBLIC_WC_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
}

if (!NEXT_PUBLIC_ALCHEMY_API_KEY) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required');
}

// Define Base Sepolia chain configuration
const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`] },
    public: { http: [`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;

const chains = [base, baseSepolia] as const;

// Configure wallet groups with Coinbase Smart Wallet as a recommended option
const walletGroups = [
  {
    groupName: 'Recommended',
    wallets: [
      coinbaseWallet({
        appName: 'Mission Enrollment',
      })
    ]
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet(),
      metaMaskWallet({
        projectId: NEXT_PUBLIC_WC_PROJECT_ID,
      }),
      walletConnectWallet({
        projectId: NEXT_PUBLIC_WC_PROJECT_ID,
      })
    ]
  }
];

// Create and export wagmi config using RainbowKit's getDefaultConfig
export const config = getDefaultConfig({
  appName: 'Mission Enrollment',
  projectId: NEXT_PUBLIC_WC_PROJECT_ID,
  chains,
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
  ssr: true,
  wallets: walletGroups,
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
    throw new Error('No ethereum provider found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    throw new Error(`Failed to switch network: ${error}`);
  }
}

// Export Base Sepolia chain configuration
export { baseSepolia };
