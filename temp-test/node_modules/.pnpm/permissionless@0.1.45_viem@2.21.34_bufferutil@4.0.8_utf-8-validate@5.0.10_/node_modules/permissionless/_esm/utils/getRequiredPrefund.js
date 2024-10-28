import { ENTRYPOINT_ADDRESS_V06 } from "./getEntryPointVersion.js";
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
export const getRequiredPrefund = ({ userOperation, entryPoint: entryPointAddress }) => {
    if (entryPointAddress === ENTRYPOINT_ADDRESS_V06) {
        const userOperationVersion0_6 = userOperation;
        const multiplier = userOperationVersion0_6.paymasterAndData.length > 2
            ? BigInt(3)
            : BigInt(1);
        const requiredGas = userOperationVersion0_6.callGasLimit +
            userOperationVersion0_6.verificationGasLimit * multiplier +
            userOperationVersion0_6.preVerificationGas;
        return (BigInt(requiredGas) * BigInt(userOperationVersion0_6.maxFeePerGas));
    }
    const userOperationV07 = userOperation;
    const multiplier = userOperationV07.paymaster ? BigInt(3) : BigInt(1);
    const verificationGasLimit = userOperationV07.verificationGasLimit +
        (userOperationV07.paymasterPostOpGasLimit || BigInt(0)) +
        (userOperationV07.paymasterVerificationGasLimit || BigInt(0));
    const requiredGas = userOperationV07.callGasLimit +
        verificationGasLimit * multiplier +
        userOperationV07.preVerificationGas;
    return BigInt(requiredGas) * BigInt(userOperationV07.maxFeePerGas);
};
//# sourceMappingURL=getRequiredPrefund.js.map