import { concat, encodeAbiParameters, keccak256, pad, toHex } from "viem";
import { isUserOperationVersion06 } from "./getEntryPointVersion.js";
function packUserOp({ userOperation, entryPoint: entryPointAddress }) {
    if (isUserOperationVersion06(entryPointAddress, userOperation)) {
        const hashedInitCode = keccak256(userOperation.initCode);
        const hashedCallData = keccak256(userOperation.callData);
        const hashedPaymasterAndData = keccak256(userOperation.paymasterAndData);
        return encodeAbiParameters([
            { type: "address" },
            { type: "uint256" },
            { type: "bytes32" },
            { type: "bytes32" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "bytes32" }
        ], [
            userOperation.sender,
            userOperation.nonce,
            hashedInitCode,
            hashedCallData,
            userOperation.callGasLimit,
            userOperation.verificationGasLimit,
            userOperation.preVerificationGas,
            userOperation.maxFeePerGas,
            userOperation.maxPriorityFeePerGas,
            hashedPaymasterAndData
        ]);
    }
    const hashedInitCode = keccak256(userOperation.factory && userOperation.factoryData
        ? concat([userOperation.factory, userOperation.factoryData])
        : "0x");
    const hashedCallData = keccak256(userOperation.callData);
    const hashedPaymasterAndData = keccak256(userOperation.paymaster
        ? concat([
            userOperation.paymaster,
            pad(toHex(userOperation.paymasterVerificationGasLimit ||
                BigInt(0)), {
                size: 16
            }),
            pad(toHex(userOperation.paymasterPostOpGasLimit || BigInt(0)), {
                size: 16
            }),
            userOperation.paymasterData || "0x"
        ])
        : "0x");
    return encodeAbiParameters([
        { type: "address" },
        { type: "uint256" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "uint256" },
        { type: "bytes32" },
        { type: "bytes32" }
    ], [
        userOperation.sender,
        userOperation.nonce,
        hashedInitCode,
        hashedCallData,
        concat([
            pad(toHex(userOperation.verificationGasLimit), {
                size: 16
            }),
            pad(toHex(userOperation.callGasLimit), { size: 16 })
        ]),
        userOperation.preVerificationGas,
        concat([
            pad(toHex(userOperation.maxPriorityFeePerGas), {
                size: 16
            }),
            pad(toHex(userOperation.maxFeePerGas), { size: 16 })
        ]),
        hashedPaymasterAndData
    ]);
}
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
export const getUserOperationHash = ({ userOperation, entryPoint: entryPointAddress, chainId }) => {
    const encoded = encodeAbiParameters([{ type: "bytes32" }, { type: "address" }, { type: "uint256" }], [
        keccak256(packUserOp({
            userOperation,
            entryPoint: entryPointAddress
        })),
        entryPointAddress,
        BigInt(chainId)
    ]);
    return keccak256(encoded);
};
//# sourceMappingURL=getUserOperationHash.js.map