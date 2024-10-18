import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, coinbaseWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from '@wagmi/core/providers/public';
import { sepolia, optimism } from '@wagmi/chains';
import scaffoldConfig from "~~/scaffold.config";

const { walletConnectProjectId, alchemyApiKey } = scaffoldConfig;

export const { chains, publicClient } = configureChains(
  [sepolia, optimism],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId: walletConnectProjectId, chains }),
      coinbaseWallet({ appName: 'MissionEnrollment', chains }),
      walletConnectWallet({ projectId: walletConnectProjectId, chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
