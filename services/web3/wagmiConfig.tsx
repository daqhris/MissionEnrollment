import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { sepolia, optimism, baseSepolia } from 'viem/chains';
import { http } from 'viem';
import scaffoldConfig from "~~/scaffold.config";

const { walletConnectProjectId } = scaffoldConfig;

const { connectors } = getDefaultWallets({
  appName: 'MissionEnrollment',
  projectId: walletConnectProjectId,
});

// Get Alchemy API key from environment variable
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Construct Base Sepolia RPC URL using Alchemy API key
const baseSepoliaRpcUrl = alchemyApiKey
  ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
  : undefined;

if (!baseSepoliaRpcUrl) {
  console.warn('Base Sepolia RPC URL could not be constructed. Please ensure NEXT_PUBLIC_ALCHEMY_API_KEY is set.');
}

// Configure wagmi with Base Sepolia as primary chain for attestations
export const wagmiConfig = createConfig({
  chains: [baseSepolia, sepolia, optimism],
  transports: {
    [baseSepolia.id]: http(baseSepoliaRpcUrl),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
  connectors,
});
