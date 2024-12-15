import { type Config, createConfig, http } from 'wagmi';
import { type Chain, base, baseSepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';

// Configure supported chains
const chains = [base, baseSepolia] as const;

// Create wagmi config with injected connector
export const config: Config = createConfig({
  chains,
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : undefined),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : undefined),
  },
});

export const getRequiredNetwork = (action: 'verification' | 'attestation'): Chain => {
  return action === 'verification' ? base : baseSepolia;
};
