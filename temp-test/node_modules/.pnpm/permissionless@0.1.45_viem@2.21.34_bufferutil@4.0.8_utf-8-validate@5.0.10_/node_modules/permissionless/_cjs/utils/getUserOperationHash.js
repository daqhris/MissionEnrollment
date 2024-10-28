"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOperationHash = void 0;
const viem_1 = require("viem");
const getEntryPointVersion_1 = require("./getEntryPointVersion.js");
function packUserOp({ userOperation, entryPoint: entryPointAddress }) {
    if ((0, getEntryPointVersion_1.isUserOperationVersion06)(entryPointAddress, userOperation)) {
        const hashedInitCode = (0, viem_1.keccak256)(userOperation.initCode);
        const hashedCallData = (0, viem_1.keccak256)(userOperation.callData);
        const hashedPaymasterAndData = (0, viem_1.keccak256)(userOperation.paymasterAndData);
        return (0, viem_1.encodeAbiParameters)([
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
    const hashedInitCode = (0, viem_1.keccak256)(userOperation.factory && userOperation.factoryData
        ? (0, viem_1.concat)([userOperation.factory, userOperation.factoryData])
        : "0x");
    const hashedCallData = (0, viem_1.keccak256)(userOperation.callData);
    const hashedPaymasterAndData = (0, viem_1.keccak256)(userOperation.paymaster
        ? (0, viem_1.concat)([
            userOperation.paymaster,
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.paymasterVerificationGasLimit ||
                BigInt(0)), {
                size: 16
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.paymasterPostOpGasLimit || BigInt(0)), {
                size: 16
            }),
            userOperation.paymasterData || "0x"
        ])
        : "0x");
    return (0, viem_1.encodeAbiParameters)([
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
        (0, viem_1.concat)([
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.verificationGasLimit), {
                size: 16
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.callGasLimit), { size: 16 })
        ]),
        userOperation.preVerificationGas,
        (0, viem_1.concat)([
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.maxPriorityFeePerGas), {
                size: 16
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(userOperation.maxFeePerGas), { size: 16 })
        ]),
        hashedPaymasterAndData
    ]);
}
const getUserOperationHash = ({ userOperation, entryPoint: entryPointAddress, chainId }) => {
    const encoded = (0, viem_1.encodeAbiParameters)([{ type: "bytes32" }, { type: "address" }, { type: "uint256" }], [
        (0, viem_1.keccak256)(packUserOp({
            userOperation,
            entryPoint: entryPointAddress
        })),
        entryPointAddress,
        BigInt(chainId)
    ]);
    return (0, viem_1.keccak256)(encoded);
};
exports.getUserOperationHash = getUserOperationHash;
//# sourceMappingURL=getUserOperationHash.js.map