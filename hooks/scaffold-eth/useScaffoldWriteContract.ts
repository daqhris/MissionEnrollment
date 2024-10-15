import { useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import type { Hash, TransactionReceipt } from "viem";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import type { ContractName } from "~~/utils/scaffold-eth/contract";

export const useScaffoldWriteContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<Abi, "nonpayable" | "payable">
>(
  contractName: TContractName,
  writeContractConfig?: Omit<Parameters<typeof useContractWrite>[0], 'abi' | 'address'>
) => {
  const [isMining, setIsMining] = useState(false);
  const [txHash, setTxHash] = useState<Hash | undefined>(undefined);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const writeTx = useTransactor();

  const { writeAsync: writeContractAsync } = useContractWrite({
    ...writeContractConfig,
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as Abi,
  } as Parameters<typeof useContractWrite>[0]);

  const { isLoading: isWaiting } = useWaitForTransaction({
    hash: txHash,
  });

  const sendContractWriteAsyncTx = async (
    args: Parameters<typeof writeContractAsync>[0],
    options?: {
      onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
      onError?: (error: Error) => void;
      onSuccess?: (txnReceipt: TransactionReceipt) => void;
    }
  ) => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return;
    }
    if (!writeContractAsync) {
      notification.error("Contract writer is not initialized");
      return;
    }
    setIsMining(true);
    try {
      const result = await writeContractAsync(args);
      setTxHash(result.hash);
      setIsMining(false);
      const receipt = await result.wait();
      options?.onSuccess?.(receipt);
    } catch (e: any) {
      const error = e as Error;
      console.error("⚡️ ~ file: useScaffoldWriteContract.ts ~ sendContractWriteAsyncTx ~ error", error);
      setIsMining(false);
      options?.onError?.(error);
    }
  };

  const sendContractWriteTx = async (
    args: Parameters<typeof writeContractAsync>[0],
    options?: {
      onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
      onError?: (error: Error) => void;
      onSuccess?: (txnReceipt: TransactionReceipt) => void;
    }
  ) => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return;
    }
    if (!writeTx) {
      notification.error("Transaction sender is not initialized");
      return;
    }
    if (!writeContractAsync) {
      notification.error("Contract writer is not initialized");
      return;
    }
    setIsMining(true);
    await writeTx(
      async () => {
        const result = await writeContractAsync(args);
        setTxHash(result.hash);
        return result.hash;
      },
      {
        onSuccess: async (hash: Hash) => {
          const receipt = await targetNetwork.provider.waitForTransaction(hash);
          setIsMining(false);
          options?.onSuccess?.(receipt);
        },
        onError: (error: Error) => {
          setIsMining(false);
          options?.onError?.(error);
        }
      }
    );
  };

  return {
    writeAsync: sendContractWriteAsyncTx,
    write: sendContractWriteTx,
    isMining,
    isWaiting,
  };
};
