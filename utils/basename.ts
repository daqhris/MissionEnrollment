import { ethers } from 'ethers';
import { getEnsName } from './ens';

// Base Name Service contract interface
const BNS_ABI = [
  'function getName(address addr) view returns (string)',
  'function getAddress(string name) view returns (address)'
];

// Base Name Service contract address on Base mainnet
const BNS_ADDRESS = '0x4D0258B3B7ee19ee4D6329AfA5c4b76591126055';

export async function getBaseName(address: string): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const bnsContract = new ethers.Contract(BNS_ADDRESS, BNS_ABI, provider);

    const name = await bnsContract.getName(address);
    if (!name) {
      console.debug(`No Base name found for address ${address}`);
      return '';
    }

    return `${name}.base.eth`;
  } catch (error) {
    // Return empty string if no basename is found or contract call fails
    console.error('Error retrieving Base name:', error);
    return '';
  }
}

export async function verifyBaseName(address: string, providedName: string): Promise<boolean> {
  // First check Base name
  if (providedName.endsWith('.base.eth')) {
    const baseName = await getBaseName(address);
    if (baseName) {
      const matches = baseName.toLowerCase() === providedName.toLowerCase();
      console.debug(`Base name verification result for ${address}: ${matches}`);
      return matches;
    }
  }

  // If no Base name matches, fallback to ENS
  try {
    const ensName = await getEnsName(address);
    if (ensName) {
      const matches = ensName.toLowerCase() === providedName.toLowerCase();
      console.debug(`ENS name verification result for ${address}: ${matches}`);
      return matches;
    }
  } catch (error) {
    console.error('Error checking ENS name:', error);
  }

  return false;
}
