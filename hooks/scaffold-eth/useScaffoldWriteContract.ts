import { useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { useContractWrite, useTransaction } from "wagmi";
import { writeContract } from "@wagmi/core";
import type { WriteContractParameters } from "@wagmi/core";
import type { Hash, TransactionReceipt } from "viem";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import type { ContractName } from "~~/utils/scaffold-eth/contract";

export const useScaffoldWriteContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<Abi, "nonpayable" | "payable">
>(
  contractName: TContractName,
  writeContractConfig?: Omit<WriteContractParameters<Abi, TFunctionName>, 'abi' | 'address'>
) => {
  const [isMining, setIsMining] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const writeTx = useTransactor();

  const { writeContract: writeContractAsync, data: writeData } = useContractWrite({
    ...writeContractConfig,
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as Abi,
  });

  const { isLoading: isWaiting } = useTransaction({
    hash: writeData ? (writeData as { hash?: `0x${string}` }).hash : undefined,
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
      if (result) {
        setIsMining(false);
        options?.onSuccess?.(result as unknown as TransactionReceipt);
      }
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
        return result.hash as Hash;
      },
      {
        onSuccess: (receipt: TransactionReceipt) => {
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
