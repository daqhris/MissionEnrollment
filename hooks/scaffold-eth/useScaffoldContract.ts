import { useTargetNetwork } from "./useTargetNetwork";
import { getContract, PublicClient, WalletClient } from "viem";
import type { Address, Chain } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { useDeployedContractInfo } from "./";
import type { Contract, ContractName } from "../../utils/scaffold-eth/contract";

/**
 * Gets a viem instance of the contract present in deployedContracts.ts or externalContracts.ts corresponding to
 * targetNetworks configured in scaffold.config.ts. Optional walletClient can be passed for doing write transactions.
 * @param config - The config settings for the hook
 * @param config.contractName - deployed contract name
 * @param config.walletClient - optional walletClient from wagmi useWalletClient hook can be passed for doing write transactions
 */
export const useScaffoldContract = <
  TContractName extends ContractName,
>({
  contractName,
}: {
  contractName: TContractName;
}) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient({ chainId: targetNetwork.id }) as PublicClient;
  const { data: walletClient } = useWalletClient({ chainId: targetNetwork.id });

  let contract: ReturnType<typeof getContract> | undefined = undefined;
  if (deployedContractData && publicClient) {
    contract = getContract({
      address: deployedContractData.address as Address,
      abi: deployedContractData.abi as Contract<TContractName>["abi"],
      client: publicClient,
    });
  }

  return {
    data: contract,
    isLoading: deployedContractLoading,
  };
};
