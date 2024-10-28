import { type Chain, type ChainFormatter, type TransactionFormatter } from 'viem';

/**
 * Formats a BigInt or number value to a string representation
 */
export function formatBigInt(value: bigint | number): string {
  if (typeof value === 'number') return value.toString();
  const isNegative = value < 0n;
  const str = value.toString().replace('-', '');
  return isNegative ? `-${str}` : str;
}

/**
 * Safely converts a BigInt value to a number using string manipulation
 * to avoid Math.pow operations
 */
export function safeBigIntToNumber(value: bigint | number | undefined): number {
  if (typeof value === 'undefined') return 0;
  if (typeof value === 'number') return value;

  const str = formatBigInt(value);
  const isNegative = str.startsWith('-');
  const absStr = str.replace('-', '');
  const parts = absStr.split('.');
  const integerPart = parts[0] || '0';

  // Early return for potential overflow
  if (integerPart.length > 16) {
    return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
  }

  // Process digits individually without using Math.pow
  let result = 0;
  const digits = integerPart.split('');

  for (let i = 0; i < digits.length; i++) {
    const currentDigit = digits[i];
    if (currentDigit === undefined) continue;

    // Use multiplication instead of Math.pow
    let multiplier = 1;
    for (let j = 0; j < digits.length - i - 1; j++) {
      if (multiplier > Number.MAX_SAFE_INTEGER / 10) {
        return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      }
      multiplier *= 10;
    }

    const digit = parseInt(currentDigit, 10);
    if (isNaN(digit)) continue;

    if (result > Number.MAX_SAFE_INTEGER - digit * multiplier) {
      return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    }
    result += digit * multiplier;
  }

  return isNegative ? -result : result;
}

/**
 * Recursively processes a chain configuration to ensure all BigInt values
 * are safely converted to numbers
 */
export function safeChainConfig(chain: Chain): Chain {
  const processValue = (value: any): any => {
    if (typeof value === 'bigint') {
      return safeBigIntToNumber(value);
    }
    if (Array.isArray(value)) {
      return value.map(processValue);
    }
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, processValue(v)])
      );
    }
    return value;
  };

  return processValue(chain);
}

// Add BigInt serialization support
if (typeof BigInt !== 'undefined') {
  (BigInt.prototype as any).toJSON = function() {
    return formatBigInt(this);
  };
}
