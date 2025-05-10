import { base, baseSepolia } from 'viem/chains';

// Network constants
export const BASE_SEPOLIA_CHAIN_ID = baseSepolia.id;
export const BASE_MAINNET_CHAIN_ID = base.id;

// Contract addresses
export const MISSION_ENROLLMENT_BASE_ETH_ADDRESS = '0xF0bC5CC2B4866dAAeCb069430c60b24520077037';
export const EAS_CONTRACT_ADDRESS_BASE = '0x4200000000000000000000000000000000000021';
export const EAS_CONTRACT_ADDRESS_SEPOLIA = '0x4200000000000000000000000000000000000021'; // Base Sepolia EAS address
export const EAS_CONTRACT_ADDRESS = (chainId: number) => 
  chainId === BASE_MAINNET_CHAIN_ID ? EAS_CONTRACT_ADDRESS_BASE : EAS_CONTRACT_ADDRESS_SEPOLIA;
export const ATTESTATION_SERVICE_ADDRESS = '0x60Ed99B474C0F02649C4038684A7C3FfF5EEe53D';

// Schema Configuration
export const SCHEMA_UID = '0xa580685123e4b999c5f1cdd30ade707da884eb258416428f2cbda0b0609f64cd';
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
export const POAP_API_URL = "https://api.poap.tech";

// Helper Functions
export const getNetworkName = (chainId: number): string => {
  return NETWORK_CONFIG[chainId]?.name || 'Unknown Network';
};

export const isCorrectNetwork = (chainId: number, action: 'verification' | 'attestation', preferredNetwork?: number): boolean => {
  if (action === 'attestation' && preferredNetwork) {
    return chainId === preferredNetwork;
  }
  return action === 'verification' ? chainId === base.id : chainId === baseSepolia.id;
};

export const getRequiredNetwork = (action: 'verification' | 'attestation', preferredNetwork?: number) => {
  if (action === 'attestation' && preferredNetwork) {
    return preferredNetwork === BASE_MAINNET_CHAIN_ID ? base : baseSepolia;
  }
  return action === 'verification' ? base : baseSepolia;
};
