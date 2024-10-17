import { useCallback, useState } from "react";
import { useContractWrite, useTransaction } from "wagmi";
import { parseEther, type TransactionReceipt, type Hash } from "viem";
import { useTargetNetwork } from "./useTargetNetwork";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";
import { ContractAbi, ContractName, UseScaffoldReadConfig } from "~~/utils/scaffold-eth/contract";

export type UseScaffoldWriteContractConfig<
  TContractName extends ContractName,
  TFunctionName extends string
> = Omit<UseScaffoldReadConfig<TContractName, TFunctionName>, "watch"> & {
  value?: string;
  blockConfirmations?: number;
  onBlockConfirmation?: (txReceipt: TransactionReceipt) => void;
};

export const useScaffoldWriteContract = <
  TContractName extends ContractName,
  TFunctionName extends string
>({
  contractName,
  functionName,
  args,
  value,
  onBlockConfirmation,
  blockConfirmations = 1,
}: UseScaffoldWriteContractConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const [isMining, setIsMining] = useState(false);

  const {
    writeAsync,
    data: writeData,
    isLoading: isWriteLoading,
    isError,
    error,
    status,
    reset,
  } = useContractWrite({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as ContractAbi<TContractName>,
    functionName,
    args: args as readonly unknown[],
    chainId: targetNetwork.id,
    value: value ? parseEther(value) : undefined,
  } as any); // Type assertion to bypass strict type checking

  const { isLoading: isWaitLoading, isSuccess } = useTransaction({
    hash: writeData?.hash as Hash | undefined,
  });

  const handleWriteContract = useCallback(
    async (writeOptions?: Partial<UseScaffoldWriteContractConfig<TContractName, TFunctionName>>) => {
      if (!writeAsync) {
        console.error("Write function is not available");
        return;
      }
      try {
        setIsMining(true);
        const result = await writeAsync();
        if (result?.hash) {
          const receipt = await useTransaction({ hash: result.hash });
          onBlockConfirmation?.(receipt.data as unknown as TransactionReceipt);
        }
        setIsMining(false);
        return result;
      } catch (error) {
        console.error("Failed to write contract", error);
        setIsMining(false);
        throw error;
      }
    },
    [writeAsync, onBlockConfirmation]
  );

  return {
    writeAsync: handleWriteContract,
    data: writeData,
    isLoading: isWriteLoading || isMining || isWaitLoading,
    isError,
    error,
    status,
    reset,
    isMining,
    isSuccess,
  };
};
