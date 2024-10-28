"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOperationByHash = void 0;
const getEntryPointVersion_1 = require("../../utils/getEntryPointVersion.js");
const getUserOperationByHash = async (client, { hash }) => {
    const params = [hash];
    const response = await client.request({
        method: "eth_getUserOperationByHash",
        params
    });
    if (!response)
        return null;
    const { userOperation, entryPoint: entryPointAddress, transactionHash, blockHash, blockNumber } = response;
    return {
        userOperation: (entryPointAddress === getEntryPointVersion_1.ENTRYPOINT_ADDRESS_V06
            ? {
                ...userOperation,
                nonce: BigInt(userOperation.nonce),
                callGasLimit: BigInt(userOperation.callGasLimit),
                verificationGasLimit: BigInt(userOperation.verificationGasLimit),
                preVerificationGas: BigInt(userOperation.preVerificationGas),
                maxFeePerGas: BigInt(userOperation.maxFeePerGas),
                maxPriorityFeePerGas: BigInt(userOperation.maxPriorityFeePerGas)
            }
            : {
                ...userOperation,
                nonce: BigInt(userOperation.nonce),
                callGasLimit: BigInt(userOperation.callGasLimit),
                verificationGasLimit: BigInt(userOperation.verificationGasLimit),
                preVerificationGas: BigInt(userOperation.preVerificationGas),
                maxFeePerGas: BigInt(userOperation.maxFeePerGas),
                maxPriorityFeePerGas: BigInt(userOperation.maxPriorityFeePerGas),
                paymasterVerificationGasLimit: userOperation.paymasterVerificationGasLimit
                    ? BigInt(userOperation.paymasterVerificationGasLimit)
                    : undefined,
                paymasterPostOpGasLimit: userOperation.paymasterVerificationGasLimit
                    ? BigInt(userOperation.paymasterPostOpGasLimit)
                    : undefined
            }),
        entryPoint: entryPointAddress,
        transactionHash: transactionHash,
        blockHash: blockHash,
        blockNumber: BigInt(blockNumber)
    };
};
exports.getUserOperationByHash = getUserOperationByHash;
//# sourceMappingURL=getUserOperationByHash.js.map