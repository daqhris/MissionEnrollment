import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { sepolia, optimism } from 'viem/chains';
import { http } from 'viem';
import scaffoldConfig from "~~/scaffold.config";

const { walletConnectProjectId } = scaffoldConfig;

const { connectors } = getDefaultWallets({
  appName: 'MissionEnrollment',
  projectId: walletConnectProjectId,
});

export const wagmiConfig = createConfig({
  chains: [sepolia, optimism],
  transports: {
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
  connectors,
});

export const chains = [sepolia, optimism];
