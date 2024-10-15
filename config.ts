import { createPublicClient, http, getContract } from 'viem';
import { mainnet, sepolia, gnosis } from 'viem/chains';

export const BLOCKSCOUT_API_URL = 'https://gnosis.blockscout.com/api';
export const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
export const GNOSIS_RPC_URL = 'https://rpc.gnosischain.com';

// POAP ABI (including necessary functions for Gnosis Chain integration)
export const POAP_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
];

// Create a public client for the Gnosis Chain
export const gnosisClient = createPublicClient({
  chain: gnosis,
  transport: http(GNOSIS_RPC_URL),
});

// Create a contract instance
export const poapContract = getContract({
  address: POAP_CONTRACT_ADDRESS,
  abi: POAP_ABI,
  client: gnosisClient,
});

// Function to safely interact with the POAP contract
export const safePoapContractCall = async (method: string, args: any[]): Promise<any> => {
  try {
    const result = await gnosisClient.readContract({
      address: POAP_CONTRACT_ADDRESS,
      abi: POAP_ABI,
      functionName: method,
      args,
    });
    return result;
  } catch (error) {
    console.error(`Error calling ${String(method)}:`, error);
    return null;
  }
};
