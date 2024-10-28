"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCompressedUserOperation = void 0;
const sendCompressedUserOperation = async (client, args) => {
    const { compressedUserOperation, inflatorAddress, entryPoint } = args;
    return client.request({
        method: "pimlico_sendCompressedUserOperation",
        params: [
            compressedUserOperation,
            inflatorAddress,
            entryPoint
        ]
    });
};
exports.sendCompressedUserOperation = sendCompressedUserOperation;
//# sourceMappingURL=sendCompressedUserOperation.js.map