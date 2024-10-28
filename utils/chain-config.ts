import { base, type Chain } from 'viem/chains';

// Safely convert chain ID to string to avoid BigInt serialization issues
const safeChainId = (chain: typeof base): Chain => {
  // Create a new chain object with the same structure but with id as number
  const chainId = typeof chain.id === 'bigint' ? Number(chain.id) : chain.id;

  return {
    ...chain,
    id: chainId,
    // Ensure all nested objects that might contain BigInt are also converted
    blockExplorers: {
      ...chain.blockExplorers,
      default: {
        ...chain.blockExplorers.default,
        // Convert any potential BigInt values in URLs or parameters
        url: chain.blockExplorers.default.url.toString(),
      },
    },
  };
};

export const chainConfig = safeChainId(base);
