'use client';

import { type Chain } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';

// Extend the base chain with our custom RPC URL while maintaining the Chain type
export const baseMainnet = {
  ...base,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || base.rpcUrls.default.http[0]],
    },
  },
} as Chain;

// Extend the baseSepolia chain with our custom RPC URL while maintaining the Chain type
export const baseSepoliaChain = {
  ...baseSepolia,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || baseSepolia.rpcUrls.default.http[0]],
    },
  },
} as Chain;

// Export the chains array for wagmi configuration
export const chains = [baseMainnet, baseSepoliaChain] as const;
