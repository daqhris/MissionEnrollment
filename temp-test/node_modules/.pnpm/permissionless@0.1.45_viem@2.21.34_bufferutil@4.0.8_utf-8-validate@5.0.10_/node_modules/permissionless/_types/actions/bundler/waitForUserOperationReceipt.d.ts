import { type Account, BaseError, type Chain, type Client, type Hash, type Transport } from "viem";
import type { Prettify } from "../../types";
import { type GetUserOperationReceiptReturnType } from "./getUserOperationReceipt";
export declare class WaitForUserOperationReceiptTimeoutError extends BaseError {
    name: string;
    constructor({ hash }: {
        hash: Hash;
    });
}
export type WaitForUserOperationReceiptParameters = {
    /** The hash of the transaction. */
    hash: Hash;
    /**
     * Polling frequency (in ms). Defaults to the client's pollingInterval config.
     * @default client.pollingInterval
     */
    pollingInterval?: number;
    /** Optional timeout (in milliseconds) to wait before stopping polling. */
    timeout?: number;
};
/**
 * Waits for the User Operation to be included on a [Block](https://viem.sh/docs/glossary/terms.html#block) (one confirmation), and then returns the [User Operation Receipt](https://docs.pimlico.io/permissionless/reference/bundler-actions/getUserOperationReceipt).
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/waitForUserOperationReceipt
 *
 * @param client - Bundler Client to use
 * @param parameters - {@link WaitForUserOperationReceiptParameters}
 * @returns The transaction receipt. {@link GetUserOperationReceiptReturnType}
 *
 * @example
 * import { createBundlerClient, waitForUserOperationReceipt, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const userOperationReceipt = await waitForUserOperationReceipt(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export declare const waitForUserOperationReceipt: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(bundlerClient: Client<TTransport, TChain, TAccount>, { hash, pollingInterval, timeout }: Prettify<WaitForUserOperationReceiptParameters>) => Promise<Prettify<GetUserOperationReceiptReturnType>>;
//# sourceMappingURL=waitForUserOperationReceipt.d.ts.map