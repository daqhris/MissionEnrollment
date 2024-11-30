import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet,
        rainbowWallet,
        metaMaskWallet,
        coinbaseWallet,
      ],
    },
    {
      groupName: "Other",
      wallets: [walletConnectWallet],
    },
  ],
  {
    appName: "MissionEnrollment",
    projectId,
  }
);
