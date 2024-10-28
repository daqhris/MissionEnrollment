import { type Chain, type ChainFormatter } from 'viem';

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

  // Check if the number exceeds safe integer bounds based on string length
  const MAX_SAFE_LENGTH = Number.MAX_SAFE_INTEGER.toString().length;
  if (integerPart.length > MAX_SAFE_LENGTH) {
    return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
  }

  // For numbers within safe bounds, we can safely use parseInt
  // as we've already verified the length is within safe limits
  const parsed = parseInt(integerPart, 10);

  // Double-check the parsed value is within safe bounds
  if (parsed > Number.MAX_SAFE_INTEGER) {
    return isNegative ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
  }
  if (parsed < Number.MIN_SAFE_INTEGER) {
    return Number.MIN_SAFE_INTEGER;
  }

  // Handle decimal part if present (truncating any decimal portion)
  // This is safe since we've already verified the integer part is within bounds
  const result = parsed;

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
