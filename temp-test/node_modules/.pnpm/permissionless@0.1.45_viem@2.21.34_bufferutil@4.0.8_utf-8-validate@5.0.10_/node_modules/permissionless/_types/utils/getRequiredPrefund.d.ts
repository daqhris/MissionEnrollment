import type { EntryPoint, GetEntryPointVersion, UserOperation } from "../types";
export type GetRequiredPrefundReturnType<entryPoint extends EntryPoint> = {
    userOperation: UserOperation<GetEntryPointVersion<entryPoint>>;
    entryPoint: entryPoint;
};
/**
 *
 * Returns the minimum required funds in the senders's smart account to execute the user operation.
 *
 * @param arags: {userOperation} as {@link UserOperation}
 * @returns requiredPrefund as {@link bigint}
 *
 * @example
 * import { getRequiredPrefund } from "permissionless/utils"
 *
 * const requiredPrefund = getRequiredPrefund({
 *     userOperation
 * })
 */
export declare const getRequiredPrefund: <entryPoint extends EntryPoint>({ userOperation, entryPoint: entryPointAddress }: GetRequiredPrefundReturnType<entryPoint>) => bigint;
//# sourceMappingURL=getRequiredPrefund.d.ts.map