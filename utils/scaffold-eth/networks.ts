import type { Chain } from "viem";
import { base } from "viem/chains";
import scaffoldConfig from "../../scaffold.config";

type ChainAttributes = {
  color: string | [string, string];
  nativeCurrencyTokenAddress?: string;
};

export type ChainWithAttributes = Chain & Partial<ChainAttributes>;

export const chains = {
  base
};

export const NETWORKS_EXTRA_DATA: Record<number, ChainAttributes> = {
  [chains.base.id]: { color: "#0052ff" },
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
  return scaffoldConfig.targetNetworks.map((targetNetwork: Chain) => ({
    ...targetNetwork,
    ...NETWORKS_EXTRA_DATA[targetNetwork.id],
  }));
}
