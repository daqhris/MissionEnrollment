import { base, type Chain } from 'viem/chains';
import type { ChainFeesFnParameters } from 'viem';

// Safely convert chain ID to string to avoid BigInt serialization issues
export const safeChainId = (chain: typeof base): Chain => {
  // Safely convert BigInt to number, handling potential overflow
  const safeBigIntToNumber = (value: bigint | number): number => {
    if (typeof value === 'bigint') {
      // Check if value is within safe integer range
      if (value <= BigInt(Number.MAX_SAFE_INTEGER)) {
        return Number(value);
      }
      // If too large, return max safe integer to avoid precision loss
      return Number.MAX_SAFE_INTEGER;
    }
    return value;
  };

  // Recursively convert any BigInt values to numbers
  const convertBigIntToNumber = (value: any): any => {
    if (typeof value === 'bigint') {
      return safeBigIntToNumber(value);
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

  // Handle fee-related functions to ensure they return numbers instead of BigInts
  const wrapFeeFn = (fn: any) => {
    return ((args: ChainFeesFnParameters) => {
      try {
        const result = fn(args);
        return typeof result === 'bigint' ? safeBigIntToNumber(result) : result;
      } catch {
        return 0;
      }
    }) as (args: ChainFeesFnParameters) => number;
  };

  // Ensure specific properties are properly handled
  return {
    ...convertedChain,
    id: safeBigIntToNumber(chain.id),
    blockExplorers: {
      ...convertedChain.blockExplorers,
      default: {
        ...convertedChain.blockExplorers.default,
        url: chain.blockExplorers.default.url.toString(),
      },
    },
    fees: chain.fees && {
      ...convertedChain.fees,
      maxPriorityFeePerGas:
        typeof chain.fees.maxPriorityFeePerGas === 'function'
          ? wrapFeeFn(chain.fees.maxPriorityFeePerGas)
          : safeBigIntToNumber(chain.fees.maxPriorityFeePerGas as bigint | number),
      defaultPriorityFee:
        typeof chain.fees.defaultPriorityFee === 'function'
          ? wrapFeeFn(chain.fees.defaultPriorityFee)
          : safeBigIntToNumber(chain.fees.defaultPriorityFee as bigint | number),
      baseFeeMultiplier: chain.fees.baseFeeMultiplier,
    },
  };
};

export const chainConfig = safeChainId(base);
