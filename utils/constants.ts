import { base, baseSepolia } from 'viem/chains';

// Network constants
export const BASE_SEPOLIA_CHAIN_ID = baseSepolia.id;
export const BASE_MAINNET_CHAIN_ID = base.id;

// Contract addresses
export const MISSION_ENROLLMENT_BASE_ETH_ADDRESS = process.env.NEXT_PUBLIC_MISSION_ENROLLMENT_ADDRESS || '';
export const EAS_CONTRACT_ADDRESS_BASE = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS_BASE || '';
export const EAS_CONTRACT_ADDRESS_SEPOLIA = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS_SEPOLIA || '';
export const EAS_CONTRACT_ADDRESS = EAS_CONTRACT_ADDRESS_SEPOLIA;
export const ATTESTATION_SERVICE_ADDRESS = process.env.NEXT_PUBLIC_ATTESTATION_SERVICE_ADDRESS || '';

// Schema Configuration
export const SCHEMA_UID = process.env.NEXT_PUBLIC_SCHEMA_UID || '';
export const SCHEMA_ENCODING = "address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol";

// Network Configuration
export const NETWORK_CONFIG: Record<number, {
  name: string;
  chainId: number;
  isTestnet: boolean;
  rpcUrl: string;
  blockExplorer: string;
}> = {
  [base.id]: {
    name: 'Base',
    chainId: base.id,
    isTestnet: false,
    rpcUrl: base.rpcUrls.default.http[0],
    blockExplorer: base.blockExplorers.default.url
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    chainId: baseSepolia.id,
    isTestnet: true,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    blockExplorer: baseSepolia.blockExplorers.default.url
  }
};

// API Endpoints
export const POAP_API_URL = process.env.NEXT_PUBLIC_POAP_API_URL || '';

// Helper Functions
export const getNetworkName = (chainId: number): string => {
  return NETWORK_CONFIG[chainId]?.name || 'Unknown Network';
};

export const isCorrectNetwork = (chainId: number, action: 'verification' | 'attestation'): boolean => {
  return action === 'verification' ? chainId === base.id : chainId === baseSepolia.id;
};

export const getRequiredNetwork = (action: 'verification' | 'attestation') => {
  return action === 'verification' ? base : baseSepolia;
};
