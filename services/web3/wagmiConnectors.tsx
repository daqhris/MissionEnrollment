import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { baseSepolia, optimismSepolia } from 'viem/chains';
import { Chain } from 'wagmi';
import scaffoldConfig from "~~/scaffold.config";

const { walletConnectProjectId } = scaffoldConfig;

// Convert viem chains to wagmi Chain type
const baseSepoliaChain: Chain = {
  id: baseSepolia.id,
  name: baseSepolia.name,
  network: baseSepolia.network,
  nativeCurrency: baseSepolia.nativeCurrency,
  rpcUrls: baseSepolia.rpcUrls,
};

const optimismSepoliaChain: Chain = {
  id: optimismSepolia.id,
  name: optimismSepolia.name,
  network: optimismSepolia.network,
  nativeCurrency: optimismSepolia.nativeCurrency,
  rpcUrls: optimismSepolia.rpcUrls,
};

export const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains: [baseSepoliaChain, optimismSepoliaChain] }),
      rainbowWallet({ chains: [baseSepoliaChain, optimismSepoliaChain], projectId: walletConnectProjectId }),
      metaMaskWallet({ chains: [baseSepoliaChain, optimismSepoliaChain], projectId: walletConnectProjectId }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      coinbaseWallet({ chains: [baseSepoliaChain, optimismSepoliaChain], appName: 'MissionEnrollment' }),
      walletConnectWallet({ chains: [baseSepoliaChain, optimismSepoliaChain], projectId: walletConnectProjectId }),
    ],
  },
]);
