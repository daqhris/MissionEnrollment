import type { Address, Chain, Client, Transport } from "viem";
import type { Prettify } from "../../types";
import type { EntryPoint } from "../../types/entrypoint";
export type GetAccountNonceParams = {
    sender: Address;
    entryPoint: EntryPoint;
    key?: bigint;
};
/**
 * Returns the nonce of the account with the entry point.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/public-actions/getAccountNonce
 *
 * @param client {@link client} that you created using viem's createPublicClient.
 * @param args {@link GetAccountNonceParams} address, entryPoint & key
 * @returns bigint nonce
 *
 * @example
 * import { createPublicClient } from "viem"
 * import { getAccountNonce } from "permissionless/actions"
 *
 * const client = createPublicClient({
 *      chain: goerli,
 *      transport: http("https://goerli.infura.io/v3/your-infura-key")
 * })
 *
 * const nonce = await getAccountNonce(client, {
 *      address,
 *      entryPoint,
 *      key
 * })
 *
 * // Return 0n
 */
export declare const getAccountNonce: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain>, args: Prettify<GetAccountNonceParams>) => Promise<bigint>;
//# sourceMappingURL=getAccountNonce.d.ts.map