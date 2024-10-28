import { base, type Chain } from 'viem/chains';

// Safely convert chain ID to string to avoid BigInt serialization issues
export const safeChainId = (chain: typeof base): Chain => {
  // Recursively convert any BigInt values to numbers
  const convertBigIntToNumber = (value: any): any => {
    if (typeof value === 'bigint') {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return value.map(convertBigIntToNumber);
    }
    if (typeof value === 'object' && value !== null) {
      const converted: { [key: string]: any } = {};
      for (const key in value) {
        converted[key] = convertBigIntToNumber(value[key]);
      }
      return converted;
    }
    return value;
  };

  // Convert the entire chain object recursively
  const convertedChain = convertBigIntToNumber(chain);

  // Ensure specific properties are properly handled
  return {
    ...convertedChain,
    id: typeof chain.id === 'bigint' ? Number(chain.id) : chain.id,
    blockExplorers: {
      ...convertedChain.blockExplorers,
      default: {
        ...convertedChain.blockExplorers.default,
        url: chain.blockExplorers.default.url.toString(),
      },
    },
  };
};

export const chainConfig = safeChainId(base);
