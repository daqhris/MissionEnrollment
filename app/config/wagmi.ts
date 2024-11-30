'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { base, Chain } from 'wagmi/chains';

// Define Base Sepolia chain following wagmi's chain structure
const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
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

if (!NEXT_PUBLIC_WC_PROJECT_ID) {
  throw new Error(
    'To connect to all Wallets you need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable'
  );
}

if (!NEXT_PUBLIC_ALCHEMY_API_KEY) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is required for RPC provider configuration');
}

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended Wallet',
    wallets: [
      coinbaseWallet({
        appName: 'Mission Enrollment',
        projectId: NEXT_PUBLIC_WC_PROJECT_ID,
      }),
    ],
  },
  {
    groupName: 'Other Wallets',
    wallets: [
      rainbowWallet({ projectId: NEXT_PUBLIC_WC_PROJECT_ID }),
      metaMaskWallet({ projectId: NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
  },
], {
  appName: 'Mission Enrollment',
  projectId: NEXT_PUBLIC_WC_PROJECT_ID,
});

// Create and export wagmi config
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
  connectors,
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
