import { type Chain } from 'viem/chains';

// Safely handle chain ID during static page generation
export const safeChainConfig = (chain: Chain) => {
  // During static page generation, ensure chain ID is handled as a number
  const id = typeof chain.id === 'bigint' ? Number(chain.id) : chain.id;
  
  return {
    ...chain,
    id,
  };
};
