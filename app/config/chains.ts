'use client';

import { type Chain } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { NEXT_PUBLIC_ALCHEMY_API_KEY } from './env';

// Extend the base chain with Alchemy RPC URL while maintaining the Chain type
export const baseMainnet = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [`https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`],
    },
    public: {
      http: [base.rpcUrls.default.http[0]],
    },
  },
} as const satisfies Chain;

// Extend the baseSepolia chain with Alchemy RPC URL while maintaining the Chain type
export const baseSepoliaChain = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`],
    },
    public: {
      http: [baseSepolia.rpcUrls.default.http[0]],
    },
  },
} as const satisfies Chain;

// Export the chains array for wagmi configuration
export const chains = [baseMainnet, baseSepoliaChain] as const;
