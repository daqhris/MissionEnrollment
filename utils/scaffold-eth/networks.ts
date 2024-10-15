import type { Chain } from "viem";
import { optimism, optimismSepolia, base, baseSepolia } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

type ChainAttributes = {
  color: string | [string, string];
  nativeCurrencyTokenAddress?: string;
};

export type ChainWithAttributes = Chain & Partial<ChainAttributes>;

export const chains = {
  optimism, optimismSepolia, base, baseSepolia
};

export const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.optimism.id]: "opt-mainnet",
  [chains.optimismSepolia.id]: "opt-sepolia",
  [chains.base.id]: "base-mainnet",
  [chains.baseSepolia.id]: "base-sepolia",
};

export const getAlchemyHttpUrl = (chainId: number): string | undefined => {
  return RPC_CHAIN_NAMES[chainId]
    ? `https://${RPC_CHAIN_NAMES[chainId]}.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`
    : undefined;
};

export const NETWORKS_EXTRA_DATA: Record<number, ChainAttributes> = {
  [chains.optimismSepolia.id]: { color: "#f01a37" },
  [chains.optimism.id]: { color: "#f01a37" },
  [chains.base.id]: { color: "#0052ff" },
  [chains.baseSepolia.id]: { color: "#0052ff" },
};

export function getBlockExplorerTxLink(chainId: number, txnHash: string): string {
  const chainNames = Object.keys(chains);
  const targetChain = chainNames.find(chainName => chains[chainName as keyof typeof chains].id === chainId);

  if (!targetChain) return "";

  const blockExplorerTxURL = chains[targetChain as keyof typeof chains]?.blockExplorers?.default?.url;
  return blockExplorerTxURL ? `${blockExplorerTxURL}/tx/${txnHash}` : "";
}

export function getBlockExplorerAddressLink(network: Chain, address: string): string {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  return blockExplorerBaseURL
    ? `${blockExplorerBaseURL}/address/${address}`
    : `https://etherscan.io/address/${address}`;
}

export function getTargetNetworks(): ChainWithAttributes[] {
  return scaffoldConfig.targetNetworks.map(targetNetwork => ({
    ...targetNetwork,
    ...NETWORKS_EXTRA_DATA[targetNetwork.id],
  }));
}
