import { useCallback, useState, useEffect } from "react";
import { useContractWrite, useWaitForTransaction, UseContractWriteConfig } from "wagmi";
import { parseEther, type TransactionReceipt } from "viem";
import { useTargetNetwork } from "./useTargetNetwork";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";
import { ContractAbi, ContractName } from "~~/utils/scaffold-eth/contract";

export type UseScaffoldWriteContractConfig<
  TContractName extends ContractName,
  TFunctionName extends string
> = {
  contractName: TContractName;
  functionName: TFunctionName;
  args?: unknown[];
  value?: string;
  onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
  blockConfirmations?: number;
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
    writeAsync: writeContract,
    data: writeData,
    error,
    isLoading: isPending,
    isError,
    isSuccess,
    status,
    reset,
  } = useContractWrite({
    ...(deployedContractData && {
      address: deployedContractData.address,
      abi: deployedContractData.abi,
    }),
    functionName,
  } as UseContractWriteConfig);

  const {
    data: receipt,
    isLoading: isWaitLoading,
    isSuccess: isWaitSuccess,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    confirmations: blockConfirmations,
  });

  const handleWriteContract = useCallback(
    async (writeOptions?: Partial<UseScaffoldWriteContractConfig<TContractName, TFunctionName>>) => {
      if (!writeContract || !deployedContractData) {
        console.error("writeContract function or contract data is not available");
        return;
      }
      try {
        setIsMining(true);
        const tx = await writeContract({
          args: writeOptions?.args || args,
          value: writeOptions?.value ? parseEther(writeOptions.value) : value ? parseEther(value) : undefined,
        });
        return tx;
      } catch (e) {
        console.error("Failed to write contract", e);
        setIsMining(false);
        throw e;
      }
    },
    [writeContract, deployedContractData, args, value]
  );

  useEffect(() => {
    if (receipt && onBlockConfirmation) {
      onBlockConfirmation(receipt as unknown as TransactionReceipt);
      setIsMining(false);
    }
  }, [receipt, onBlockConfirmation]);

  return {
    writeContract: handleWriteContract,
    data: writeData,
    isLoading: isPending || isMining || isWaitLoading,
    isError,
    isSuccess,
    error,
    status,
    reset,
    isMining,
    isWaitSuccess,
  };
};
