import { base, baseSepolia } from 'viem/chains';

export const SUPPORTED_NETWORKS = {
  mainnet: base,
  testnet: baseSepolia,
};

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.mainnet;

export const NETWORK_DETAILS = {
  [base.id]: {
    name: 'Base',
    isTestnet: false,
    explorerUrl: 'https://basescan.org',
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    isTestnet: true,
    explorerUrl: 'https://sepolia.basescan.org',
  },
};

export function getRequiredNetwork(action: 'attestation' | 'verification'): typeof base | typeof baseSepolia {
  switch (action) {
    case 'attestation':
      return SUPPORTED_NETWORKS.testnet; // Base Sepolia for attestations
    case 'verification':
      return SUPPORTED_NETWORKS.mainnet; // Base mainnet for identity verification
    default:
      return DEFAULT_NETWORK;
  }
}
