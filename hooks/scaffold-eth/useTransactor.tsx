import { getPublicClient } from "@wagmi/core";
import type { Hash, SendTransactionParameters, WalletClient as VWalletClient, PublicClient } from "viem";
import { useWalletClient } from "wagmi";
import type { Config } from "wagmi";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { getBlockExplorerTxLink, getParsedError, notification } from "~~/utils/scaffold-eth";
import type { TransactorFuncOptions } from "~~/utils/scaffold-eth/contract";
import { ReactNode } from "react";

type TransactionFunc = (
  tx: (() => Promise<Hash>) | SendTransactionParameters,
  options?: TransactorFuncOptions,
) => Promise<Hash | undefined>;

/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({ message, blockExplorerLink }: { message: string; blockExplorerLink?: string }): ReactNode => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
      {blockExplorerLink && blockExplorerLink.length > 0 ? (
        <a href={blockExplorerLink} target="_blank" rel="noreferrer" className="block link text-md">
          check out transaction
        </a>
      ) : null}
    </div>
  );
};

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useTransactor = (_walletClient?: VWalletClient): TransactionFunc => {
  let walletClient = _walletClient;
  const { data: walletClientData } = useWalletClient();
  if (walletClient === undefined && walletClientData) {
    walletClient = walletClientData as VWalletClient;
  }

  const result: TransactionFunc = async (tx, options) => {
    if (!walletClient) {
      notification.error("Cannot access account");
      console.error("⚡️ ~ file: useTransactor.tsx ~ error");
      return;
    }

    let notificationId: string | null = null;
    let transactionHash: Hash | undefined = undefined;
    try {
      const network = await walletClient.getChainId();
      const publicClient = getPublicClient(wagmiConfig as any) as PublicClient;

      notificationId = notification.loading(<TxnNotification message="Awaiting for user confirmation" />) as string;
      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        transactionHash = result;
      } else if (tx != null) {
        transactionHash = await walletClient.sendTransaction(tx as SendTransactionParameters);
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      if (notificationId) {
        notification.remove(notificationId);
      }

      const blockExplorerTxURL = network && transactionHash ? getBlockExplorerTxLink(network, transactionHash) : "";

      notificationId = notification.loading(
        <TxnNotification message="Waiting for transaction to complete." blockExplorerLink={blockExplorerTxURL} />
      ) as string;

      const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: options?.blockConfirmations,
      });
      if (notificationId) {
        notification.remove(notificationId);
      }

      notification.success(
        <TxnNotification message="Transaction completed successfully!" blockExplorerLink={blockExplorerTxURL} />,
        {
          icon: "🎉",
        },
      );

      if (options?.onBlockConfirmation) options.onBlockConfirmation(transactionReceipt);
    } catch (error: unknown) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
      const message = getParsedError(error);
      notification.error(message);
      throw error;
    }

    return transactionHash;
  };

  return result;
};