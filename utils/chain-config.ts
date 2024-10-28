import { base, type Chain } from 'viem/chains';
import type { ChainFeesFnParameters } from 'viem';

// Safely convert chain ID to string to avoid BigInt serialization issues
export const safeChainId = (chain: typeof base): Chain => {
  // Format BigInt to string representation without using Math operations
  const formatBigInt = (value: bigint | number): string => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value.toString();
  };

  // Safely convert BigInt to number using string manipulation
  const safeBigIntToNumber = (value: bigint | number): number => {
    if (typeof value === 'bigint') {
      const str = formatBigInt(value);
      // Remove any decimal places for integer conversion
      const [integerPart] = str.split('.');
      // Parse the string representation, defaulting to MAX_SAFE_INTEGER if too large
      const num = Number(integerPart);
      return num > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : num;
    }
    return value;
  };

  // Recursively convert any BigInt values to numbers using string manipulation
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
        if (typeof result === 'bigint') {
          return safeBigIntToNumber(result);
        }
        return result;
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
