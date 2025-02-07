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

// Configure wagmi with Base as primary chain for initial user experience
// Base Sepolia will be used later for attestations
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, sepolia, optimism],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || ''),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || ''),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
  connectors,
});
