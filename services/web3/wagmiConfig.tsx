import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { baseSepolia, optimismSepolia } from 'viem/chains';
import scaffoldConfig from "~~/scaffold.config";

const { walletConnectProjectId, alchemyApiKey } = scaffoldConfig;

export const wagmiConfig = getDefaultConfig({
  appName: 'MissionEnrollment',
  projectId: walletConnectProjectId,
  chains: [baseSepolia, optimismSepolia],
  transports: {
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
    [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },
  ssr: true,
});
