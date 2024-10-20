import { JsonRpcProvider, Contract, InterfaceAbi, FunctionFragment, Networkish } from "ethers";



export const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.ankr.com/eth';

// POAP ABI (including necessary functions for POAP interaction)
export const POAP_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
] as const;

// Create a provider
export const provider = new JsonRpcProvider(RPC_URL);

// Create a contract instance
export const poapContract = new Contract(POAP_CONTRACT_ADDRESS, POAP_ABI as InterfaceAbi, provider);

// Define the type for POAP_ABI keys
export type POAPContractMethod = (typeof POAP_ABI)[number];

// Function to safely interact with the POAP contract
export const safePoapContractCall = async <T>(
  method: POAPContractMethod,
  args: any[]
): Promise<T | null> => {
  try {
    const fragment = FunctionFragment.from(method);
    if (fragment && typeof poapContract[fragment.name as keyof typeof poapContract] === 'function') {
      const result = await (poapContract[fragment.name as keyof typeof poapContract] as Function)(...args);
      return result as T;
    }
    throw new Error(`Method ${method} is not a function`);
  } catch (error) {
    console.error(`Error calling ${method}:`, error);
    return null;
  }
};

// Export necessary ethers components for use in other parts of the application
export { JsonRpcProvider, Contract };

// TODO: Update other files using ethers to v6 API
// 1. Identify all files using ethers
// 2. Update imports to use named imports where necessary
// 3. Update provider creation (JsonRpcProvider instead of providers.JsonRpcProvider)
// 4. Update contract interactions (no need for .connect() in most cases)
// 5. Update event listeners and error handling
// 6. Update transaction sending and waiting for confirmations
