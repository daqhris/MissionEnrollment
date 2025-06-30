import { parseEther } from 'viem';

export const createSponsoredTransaction = (
  to: `0x${string}`,
  value: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const calls = [{
    to,
    value: parseEther(value),
    data: '0x' as `0x${string}`,
  }];

  return {
    calls,
    onSuccess,
    onError,
  };
};
