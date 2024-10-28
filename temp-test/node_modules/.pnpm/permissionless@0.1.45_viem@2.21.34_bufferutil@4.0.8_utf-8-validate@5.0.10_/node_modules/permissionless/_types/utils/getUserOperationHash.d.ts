import type { Hash } from "viem";
import type { EntryPoint, GetEntryPointVersion } from "../types";
import type { UserOperation } from "../types/userOperation";
export type GetUserOperationHashParams<entryPoint extends EntryPoint> = {
    userOperation: UserOperation<GetEntryPointVersion<entryPoint>>;
    entryPoint: entryPoint;
    chainId: number;
};
/**
 *
 * Returns user operation hash that is a unique identifier of the user operation.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/utils/getUserOperationHash
 *
 * @param args: userOperation, entryPoint, chainId as {@link GetUserOperationHashParams}
 * @returns userOperationHash as {@link Hash}
 *
 * @example
 * import { getUserOperationHash } from "permissionless/utils"
 *
 * const userOperationHash = getUserOperationHash({
 *      userOperation,
 *      entryPoint,
 *      chainId
 * })
 *
 * // Returns "0xe9fad2cd67f9ca1d0b7a6513b2a42066784c8df938518da2b51bb8cc9a89ea34"
 *
 */
export declare const getUserOperationHash: <entryPoint extends EntryPoint>({ userOperation, entryPoint: entryPointAddress, chainId }: GetUserOperationHashParams<entryPoint>) => Hash;
//# sourceMappingURL=getUserOperationHash.d.ts.map