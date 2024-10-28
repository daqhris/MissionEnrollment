import { type Chain } from 'viem';
import { safeBigIntToNumber } from './bigint';

// Process all numeric values in the chain configuration
export function processChainConfig(chain: Chain): Chain {
  const processValue = (value: any): any => {
    if (typeof value === 'bigint') {
      return safeBigIntToNumber(value);
    }
    if (typeof value === 'object' && value !== null) {
      return Array.isArray(value)
        ? value.map(processValue)
        : Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, processValue(v)])
          );
    }
    return value;
  };

  // Process the entire chain object recursively
  return processValue(chain) as Chain;
}

// Safe chain configuration handler
export function safeChainConfig(chain: Chain): Chain {
  try {
    return processChainConfig(chain);
  } catch (error) {
    console.warn('Error processing chain configuration:', error);
    // Return a minimal safe chain config if processing fails
    return {
      ...chain,
      id: typeof chain.id === 'bigint' ? Number(chain.id) : chain.id,
    };
  }
}
