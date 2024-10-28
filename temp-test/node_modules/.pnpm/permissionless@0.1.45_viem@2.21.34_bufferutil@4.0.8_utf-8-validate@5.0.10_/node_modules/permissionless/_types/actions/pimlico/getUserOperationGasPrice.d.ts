import type { Account, Chain, Client, Transport } from "viem";
import type { Prettify } from "../../types";
import type { PimlicoBundlerRpcSchema } from "../../types/pimlico";
export type GetUserOperationGasPriceReturnType = {
    slow: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
    standard: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
    fast: {
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    };
};
/**
 * Returns the live gas prices that you can use to send a user operation.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/pimlico-bundler-actions/getUserOperationGasPrice
 *
 * @param client that you created using viem's createClient whose transport url is pointing to the Pimlico's bundler.
 * @returns slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { getUserOperationGasPrice } from "permissionless/actions/pimlico"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
 * })
 *
 * await getUserOperationGasPrice(bundlerClient)
 *
 */
export declare const getUserOperationGasPrice: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(client: Client<TTransport, TChain, TAccount, PimlicoBundlerRpcSchema>) => Promise<Prettify<GetUserOperationGasPriceReturnType>>;
//# sourceMappingURL=getUserOperationGasPrice.d.ts.map