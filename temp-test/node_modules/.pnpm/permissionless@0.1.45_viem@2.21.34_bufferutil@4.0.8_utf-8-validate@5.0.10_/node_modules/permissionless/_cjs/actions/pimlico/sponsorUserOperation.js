"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sponsorUserOperation = void 0;
const deepHexlify_1 = require("../../utils/deepHexlify.js");
const getEntryPointVersion_1 = require("../../utils/getEntryPointVersion.js");
const sponsorUserOperation = async (client, args) => {
    const response = await client.request({
        method: "pm_sponsorUserOperation",
        params: args.sponsorshipPolicyId
            ? [
                (0, deepHexlify_1.deepHexlify)(args.userOperation),
                args.entryPoint,
                {
                    sponsorshipPolicyId: args.sponsorshipPolicyId
                }
            ]
            : [
                (0, deepHexlify_1.deepHexlify)(args.userOperation),
                args.entryPoint
            ]
    });
    if (args.entryPoint === getEntryPointVersion_1.ENTRYPOINT_ADDRESS_V06) {
        const responseV06 = response;
        return {
            paymasterAndData: responseV06.paymasterAndData,
            preVerificationGas: BigInt(responseV06.preVerificationGas),
            verificationGasLimit: BigInt(responseV06.verificationGasLimit),
            callGasLimit: BigInt(responseV06.callGasLimit)
        };
    }
    const responseV07 = response;
    return {
        callGasLimit: BigInt(responseV07.callGasLimit),
        verificationGasLimit: BigInt(responseV07.verificationGasLimit),
        preVerificationGas: BigInt(responseV07.preVerificationGas),
        paymaster: responseV07.paymaster,
        paymasterVerificationGasLimit: BigInt(responseV07.paymasterVerificationGasLimit),
        paymasterPostOpGasLimit: BigInt(responseV07.paymasterPostOpGasLimit),
        paymasterData: responseV07.paymasterData
    };
};
exports.sponsorUserOperation = sponsorUserOperation;
//# sourceMappingURL=sponsorUserOperation.js.map