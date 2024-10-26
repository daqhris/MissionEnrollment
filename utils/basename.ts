import { ethers } from 'ethers';

export async function getBaseName(address: string): Promise<string> {
  return `${address.slice(0, 6)}...${address.slice(-4)}.base`;
}

export async function verifyBaseName(address: string, providedName: string): Promise<boolean> {
  const baseName = await getBaseName(address);
  return baseName.toLowerCase() === providedName.toLowerCase();
}
