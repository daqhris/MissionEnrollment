import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { base, baseSepolia, sepolia, optimism } from 'viem/chains';
import { http } from 'viem';
import scaffoldConfig from "../../scaffold.config";

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

// Configure wagmi with Base as primary chain for initial user experience
// Base Sepolia will be used later for attestations
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, sepolia, optimism],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http(baseSepoliaRpcUrl),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
  connectors,
});
