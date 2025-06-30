import { JsonRpcProvider } from 'ethers';

export async function getEnsName(address: string): Promise<string> {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth');
  try {
    const ensName = await provider.lookupAddress(address);
    return ensName || '';
  } catch (error) {
    console.error('Error retrieving ENS name:', error);
    return '';
  }
}

export async function verifyEnsName(address: string, name: string): Promise<boolean> {
  try {
    const ensName = await getEnsName(address);
    return ensName.toLowerCase() === name.toLowerCase();
  } catch (error) {
    console.error('Error verifying ENS name:', error);
    return false;
  }
}
