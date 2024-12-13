import { getName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { getEnsName } from './ens';

export async function getBaseName(address: string): Promise<string> {
  try {
    const name = await getName({ address, chain: base });
    if (!name) {
      console.debug(`No Base name found for address ${address}`);
      return '';
    }

    return name; // getName from OnchainKit already includes .base.eth suffix
  } catch (error) {
    console.error('Error retrieving Base name:', error);
    return '';
  }
}

export async function verifyBaseName(address: string, providedName: string): Promise<boolean> {
  if (providedName.endsWith('.base.eth')) {
    const baseName = await getBaseName(address);
    if (baseName) {
      const matches = baseName.toLowerCase() === providedName.toLowerCase();
      console.debug(`Base name verification result for ${address}: ${matches}`);
      return matches;
    }
  }

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
