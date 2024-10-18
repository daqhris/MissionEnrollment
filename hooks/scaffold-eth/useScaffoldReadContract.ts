import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import type { ExtractAbiFunctionNames } from "abitype";
import type { ReadContractErrorType } from "viem";
import { useBlockNumber, useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import type {
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
  UseScaffoldReadConfig,
} from "~~/utils/scaffold-eth/contract";

export const useScaffoldReadContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const { watch, ...readContractConfig } = readConfig;
  // set watch to true by default
  const defaultWatch = watch ?? true;

  const readContractHookRes = useContractRead({
    chainId: targetNetwork.id,
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    args: args as readonly unknown[],
    ...readContractConfig,
    enabled: !Array.isArray(args) || !args.some(arg => arg === undefined),
  });

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: defaultWatch,
    chainId: targetNetwork.id,
  });

  useEffect(() => {
    if (defaultWatch) {
      queryClient.invalidateQueries();
    }
  }, [blockNumber, defaultWatch, queryClient]);

  return {
    ...readContractHookRes,
    data: readContractHookRes.data as AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName> | undefined,
    refetch: readContractHookRes.refetch as unknown as (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>, ReadContractErrorType>>,
  };
};
