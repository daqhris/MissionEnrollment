import { type Chain } from 'viem/chains';

// Safely handle chain ID during static page generation
export const safeChainConfig = (chain: Chain) => {
  // During static page generation, ensure chain ID is handled as a number
  const id = typeof chain.id === 'bigint' ? safeBigIntToNumber(chain.id) : chain.id;

  return {
    ...chain,
    id,
  };
};

// Convert BigInt to string then to number safely
function safeBigIntToNumber(value: bigint): number {
  const str = value.toString();
  const isNegative = str.startsWith('-');
  const absStr = str.replace('-', '');

  // If number is too large, return MAX_SAFE_INTEGER
  if (absStr.length > Number.MAX_SAFE_INTEGER.toString().length) {
    return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
  }

  const num = parseInt(absStr, 10);
  if (num > Number.MAX_SAFE_INTEGER) {
    return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
  }

  return isNegative ? -num : num;
}
