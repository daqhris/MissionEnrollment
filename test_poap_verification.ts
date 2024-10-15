import { ethers } from 'ethers';
import axios from 'axios';

const POAP_API_KEY = process.env.POAP_API_KEY || '81BDT3A1kc2mfQE2edNqymulkmMUvXCBnlF1X5yxcuYXByNVbbU78IZ9ls2nUc15S9HMV4kdrTT1GxlGVgHMg1o5UF0b7zETZyuPJeQannunkcqYtTUUfUDcCEiiihy2';
const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
const POAP_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];

async function verifyPOAPOwnership(walletAddress: string, poapId: string): Promise<boolean> {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.gnosischain.com');
    const poapContract = new ethers.Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);

    const balance = await poapContract.balanceOf(walletAddress);
    console.log(`POAP balance for ${walletAddress}: ${balance.toString()}`);

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await poapContract.tokenOfOwnerByIndex(walletAddress, i);
      console.log(`Token ID: ${tokenId.toString()}`);
      if (tokenId.toString() === poapId) {
        console.log(`POAP with ID ${poapId} found for wallet ${walletAddress}`);
        return true;
      }
    }

    console.log(`POAP with ID ${poapId} not found for wallet ${walletAddress}`);
    return false;
  } catch (error) {
    console.error('Error verifying POAP ownership:', error);
    return false;
  }
}

async function main() {
  const walletAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
  const poapId = '7169394';

  const result = await verifyPOAPOwnership(walletAddress, poapId);
  console.log(`POAP verification result: ${result}`);
}

main().catch(console.error);
