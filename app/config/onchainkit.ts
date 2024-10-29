import { base } from 'viem/chains';
import { safeChainId } from '../../utils/chain-config';

export const onchainKitConfig = {
  apiKey: process.env.NEXT_PUBLIC_CDP_API_KEY as string,
  chain: safeChainId(base),
};
