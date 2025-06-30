import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  onlyLocalBurnerWallet: boolean;
  walletConnectProjectId: string;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.base],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  // WalletConnect Project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLET_CONNECT_PROJECT_ID",
} as const;

export default scaffoldConfig;
