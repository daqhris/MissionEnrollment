import { JsonRpcProvider, Contract, Wallet, InterfaceAbi } from 'ethers';

export const BLOCKSCOUT_API_URL = 'https://gnosis.blockscout.com/api';
export const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
export const GNOSIS_RPC_URL = `https://rpc.gnosischain.com/${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''}`;

// POAP ABI (including necessary functions for Gnosis Chain integration)
export const POAP_ABI: InterfaceAbi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
];

// Create a provider for the Gnosis Chain
export const createGnosisProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider(GNOSIS_RPC_URL);
};

// Create a contract instance
export const createPoapContract = (): Contract => {
  const provider = createGnosisProvider();
  return new Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);
};

// Function to safely interact with the POAP contract
export const safePoapContractCall = async <T>(
  method: string,
  ...args: any[]
): Promise<T | null> => {
  try {
    const contract = createPoapContract();
    if (contract && typeof contract[method] === 'function') {
      const result = await contract[method](...args);
      return result as T;
    }
    console.error(`Method ${method} not found on contract`);
    return null;
  } catch (error) {
    console.error(`Error calling ${String(method)}:`, error);
    return null;
  }
};
