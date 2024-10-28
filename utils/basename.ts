import { getName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { getEnsName } from './ens';
import { Address, isAddress } from 'viem';

export async function getBaseName(address: string): Promise<string> {
  try {
    // Ensure address is valid and properly formatted
    if (!isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    const name = await getName({ address: address as Address, chain: base });
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
  // Validate address format
  if (!isAddress(address)) {
    console.error('Invalid Ethereum address provided for verification');
    return false;
  }

  const formattedAddress = address as Address;

  // First check Base name
  if (providedName.endsWith('.base.eth')) {
    const baseName = await getBaseName(address);
    if (baseName) {
      const matches = baseName.toLowerCase() === providedName.toLowerCase();
      console.debug(`Base name verification result for ${formattedAddress}: ${matches}`);
      return matches;
    }
  }

  // If no Base name matches, fallback to ENS
  try {
    const ensName = await getEnsName(formattedAddress);
    if (ensName) {
      const matches = ensName.toLowerCase() === providedName.toLowerCase();
      console.debug(`ENS name verification result for ${formattedAddress}: ${matches}`);
      return matches;
    }
  } catch (error) {
    console.error('Error checking ENS name:', error);
  }

  return false;
}
