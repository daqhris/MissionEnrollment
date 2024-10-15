import { ethers } from 'ethers';

export async function getBaseName(address: string): Promise<string> {
  return `${address.slice(0, 6)}...${address.slice(-4)}.base`;
}
