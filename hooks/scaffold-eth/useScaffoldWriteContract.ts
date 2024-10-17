import { useCallback, useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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
    writeContract,
    data: writeData,
    error,
    isPending,
    isError,
    isSuccess,
    status,
    reset,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isWaitLoading,
    isSuccess: isWaitSuccess,
  } = useWaitForTransactionReceipt({
    hash: writeData,
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
        await writeContract({
          address: deployedContractData.address,
          abi: deployedContractData.abi,
          functionName,
          args,
          value: value ? parseEther(value) : undefined,
        });
        // We don't return anything here as the transaction hash will be available in writeData
      } catch (e) {
        console.error("Failed to write contract", e);
        setIsMining(false);
        throw e;
      }
    },
    [writeContract, deployedContractData, functionName, args, value]
  );

  // Use an effect to handle the confirmation when receipt is available
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
