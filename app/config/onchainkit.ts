import { baseMainnet } from './chains';
import { base } from 'viem/chains';

export const onchainKitConfig = {
  apiKey: process.env.NEXT_PUBLIC_CDP_API_KEY as string,
  chain: {
    ...base,
    ...baseMainnet,
    blockExplorers: baseMainnet.blockExplorers,
    formatters: baseMainnet.formatters,
  },
};
