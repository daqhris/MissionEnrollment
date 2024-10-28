"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateUserOperationGas = void 0;
const utils_1 = require("../../utils/index.js");
const deepHexlify_1 = require("../../utils/deepHexlify.js");
const getEstimateUserOperationGasError_1 = require("../../utils/errors/getEstimateUserOperationGasError.js");
const estimateUserOperationGas = async (client, args, stateOverrides) => {
    const { userOperation, entryPoint } = args;
    const userOperationWithBigIntAsHex = (0, deepHexlify_1.deepHexlify)(userOperation);
    const stateOverridesWithBigIntAsHex = (0, deepHexlify_1.deepHexlify)(stateOverrides);
    try {
        const response = await client.request({
            method: "eth_estimateUserOperationGas",
            params: stateOverrides
                ? [
                    userOperationWithBigIntAsHex,
                    entryPoint,
                    stateOverridesWithBigIntAsHex
                ]
                : [userOperationWithBigIntAsHex, entryPoint]
        });
        const entryPointVersion = (0, utils_1.getEntryPointVersion)(entryPoint);
        if (entryPointVersion === "v0.6") {
            const responseV06 = response;
            return {
                preVerificationGas: BigInt(responseV06.preVerificationGas || 0),
                verificationGasLimit: BigInt(responseV06.verificationGasLimit || 0),
                callGasLimit: BigInt(responseV06.callGasLimit || 0)
            };
        }
        const responseV07 = response;
        return {
            preVerificationGas: BigInt(responseV07.preVerificationGas || 0),
            verificationGasLimit: BigInt(responseV07.verificationGasLimit || 0),
            callGasLimit: BigInt(responseV07.callGasLimit || 0),
            paymasterVerificationGasLimit: responseV07.paymasterVerificationGasLimit
                ? BigInt(responseV07.paymasterVerificationGasLimit)
                : undefined,
            paymasterPostOpGasLimit: responseV07.paymasterPostOpGasLimit
                ? BigInt(responseV07.paymasterPostOpGasLimit)
                : undefined
        };
    }
    catch (err) {
        throw (0, getEstimateUserOperationGasError_1.getEstimateUserOperationGasError)(err, args);
    }
};
exports.estimateUserOperationGas = estimateUserOperationGas;
//# sourceMappingURL=estimateUserOperationGas.js.map