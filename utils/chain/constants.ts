import { type Chain } from 'viem';
import { base } from 'viem/chains';

// Pre-calculated values as strings to avoid Math.pow operations
const CHAIN_CONSTANTS = {
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://basescan.org'
    },
    etherscan: {
      name: 'Basescan',
      url: 'https://basescan.org'
    }
  },
  // Use string representations for large numbers
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  network: 'base',
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
      webSocket: ['wss://mainnet.base.org']
    },
    public: {
      http: ['https://mainnet.base.org'],
      webSocket: ['wss://mainnet.base.org']
    }
  }
};

// Create a safe chain configuration that avoids BigInt operations
export function createSafeChainConfig(): Chain {
  return {
    ...base,
    ...CHAIN_CONSTANTS,
    formatters: undefined // Remove formatters to avoid potential BigInt operations
  };
}
