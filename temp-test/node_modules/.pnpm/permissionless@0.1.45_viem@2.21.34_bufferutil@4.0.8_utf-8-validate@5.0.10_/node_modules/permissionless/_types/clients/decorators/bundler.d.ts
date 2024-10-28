import type { Client, Hash } from "viem";
import { type EstimateUserOperationGasParameters, type EstimateUserOperationGasReturnType } from "../../actions/bundler/estimateUserOperationGas";
import { type GetUserOperationByHashParameters, type GetUserOperationByHashReturnType } from "../../actions/bundler/getUserOperationByHash";
import { type GetUserOperationReceiptParameters, type GetUserOperationReceiptReturnType } from "../../actions/bundler/getUserOperationReceipt";
import { type SendUserOperationParameters } from "../../actions/bundler/sendUserOperation";
import { type WaitForUserOperationReceiptParameters } from "../../actions/bundler/waitForUserOperationReceipt";
import type { Prettify } from "../../types";
import type { StateOverrides } from "../../types/bundler";
import type { EntryPoint } from "../../types/entrypoint";
export type BundlerActions<entryPoint extends EntryPoint> = {
    /**
     *
     * Sends user operation to the bundler
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/sendUserOperation
     *
     * @param args {@link SendUserOperationParameters}.
     * @returns UserOpHash that you can use to track user operation as {@link Hash}.
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
     * }).extend(bundlerActions)
     *
     * const userOpHash = await bundlerClient.sendUserOperation({
     *      userOperation: signedUserOperation,
     *      entryPoint: entryPoint
     * })
     *
     * // Return '0xe9fad2cd67f9ca1d0b7a6513b2a42066784c8df938518da2b51bb8cc9a89ea34'
     */
    sendUserOperation: (args: Prettify<Omit<SendUserOperationParameters<entryPoint>, "entryPoint">>) => Promise<Hash>;
    /**
     *
     * Estimates preVerificationGas, verificationGasLimit and callGasLimit for user operation
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/estimateUserOperationGas
     *
     * @param args {@link EstimateUserOperationGasParameters}
     * @returns preVerificationGas, verificationGasLimit and callGasLimit as {@link EstimateUserOperationGasReturnType}
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http(BUNDLER_URL)
     * }).extend(bundlerActions)
     *
     * const gasParameters = await bundlerClient.estimateUserOperationGas({
     *     userOperation: signedUserOperation,
     *    entryPoint: entryPoint
     * })
     *
     * // Return {preVerificationGas: 43492n, verificationGasLimit: 59436n, callGasLimit: 9000n}
     */
    estimateUserOperationGas: (args: Prettify<Omit<EstimateUserOperationGasParameters<entryPoint>, "entryPoint">>, stateOverrides?: StateOverrides) => Promise<Prettify<EstimateUserOperationGasReturnType<entryPoint>>>;
    /**
     *
     * Returns the supported entrypoints by the bundler service
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/supportedEntryPoints
     *
     * @returns Supported entryPoints
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http(BUNDLER_URL)
     * }).extend(bundlerActions)
     *
     * const supportedEntryPoints = await bundlerClient.supportedEntryPoints()
     *
     * // Return ['0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789']
     */
    supportedEntryPoints: () => Promise<EntryPoint[]>;
    /**
     *
     * Returns the supported chain id by the bundler service
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/chainId
     *
     * @returns Supported chain id
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http(BUNDLER_URL)
     * }).extend(bundlerActions)
     *
     * const chainId = await bundlerClient.chainId()
     * // Return 5n for Goerli
     */
    chainId: () => Promise<number>;
    /**
     *
     * Returns the user operation from userOpHash
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/getUserOperationByHash
     *
     * @param args {@link GetUserOperationByHash} UserOpHash that was returned by {@link sendUserOperation}
     * @returns userOperation along with entryPoint, transactionHash, blockHash, blockNumber if found or null
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http(BUNDLER_URL)
     * }).extend(bundlerActions)
     *
     * await bundlerClient.getUserOperationByHash(userOpHash)
     *
     */
    getUserOperationByHash: (args: Prettify<GetUserOperationByHashParameters>) => Promise<Prettify<GetUserOperationByHashReturnType<entryPoint>> | null>;
    /**
     *
     * Returns the user operation receipt from userOpHash
     *
     * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/getUserOperationReceipt
     *
     * @param args {@link GetUserOperationReceiptParameters} UserOpHash that was returned by {@link sendUserOperation}
     * @returns user operation receipt {@link GetUserOperationReceiptReturnType} if found or null
     *
     * @example
     * import { createClient } from "viem"
     * import { bundlerActions } from "permissionless"
     *
     * const bundlerClient = createClient({
     *      chain: goerli,
     *      transport: http(BUNDLER_URL)
     * }).extend(bundlerActions)
     *
     * await bundlerClient.getUserOperationReceipt({hash: userOpHash})
     *
     */
    getUserOperationReceipt: (args: Prettify<GetUserOperationReceiptParameters>) => Promise<Prettify<GetUserOperationReceiptReturnType> | null>;
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
     * const bundlerClient = createBundlerClient({
     *   chain: mainnet,
     *   transport: http(),
     * })
     * const userOperationReceipt = await bundlerClient.waitForUserOperationReceipt({
     *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
     * })
     */
    waitForUserOperationReceipt: (args: Prettify<WaitForUserOperationReceiptParameters>) => Promise<Prettify<GetUserOperationReceiptReturnType>>;
};
declare const bundlerActions: <entryPoint extends EntryPoint>(entryPointAddress: entryPoint) => (client: Client) => BundlerActions<entryPoint>;
export { bundlerActions };
//# sourceMappingURL=bundler.d.ts.map