'use client';

import { type Chain } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Extend the base chain with public RPC URL while maintaining the Chain type
export const baseMainnet: Chain = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [base.rpcUrls.default.http[0]],
    },
    public: {
      http: [base.rpcUrls.default.http[0]],
    },
  },
};

// Extend the baseSepolia chain with public RPC URL while maintaining the Chain type
export const baseSepoliaChain: Chain = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [baseSepolia.rpcUrls.default.http[0]],
    },
    public: {
      http: [baseSepolia.rpcUrls.default.http[0]],
    },
  },
};

// Export the chains array for wagmi configuration
export const chains = [baseMainnet, baseSepoliaChain] as const;
