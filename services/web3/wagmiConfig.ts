import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "viem/chains";
import { http } from "wagmi";
import { connectors } from "./wagmiConnectors";

export const wagmiConfig = getDefaultConfig({
  appName: "MissionEnrollment",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors,
});
