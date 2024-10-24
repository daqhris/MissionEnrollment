import { JsonRpcProvider } from 'ethers';

export async function getEnsName(address: string): Promise<string> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '');
  try {
    const ensName = await provider.lookupAddress(address);
    return ensName || '';
  } catch (error) {
    console.error('Error retrieving ENS name:', error);
    return '';
  }
}
