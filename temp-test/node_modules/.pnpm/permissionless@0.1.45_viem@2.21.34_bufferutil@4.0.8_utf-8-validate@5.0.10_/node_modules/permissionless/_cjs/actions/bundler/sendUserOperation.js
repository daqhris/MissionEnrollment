"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserOperation = void 0;
const deepHexlify_1 = require("../../utils/deepHexlify.js");
const getSendUserOperationError_1 = require("../../utils/errors/getSendUserOperationError.js");
const sendUserOperation = async (client, args) => {
    const { userOperation, entryPoint } = args;
    try {
        const userOperationHash = await client.request({
            method: "eth_sendUserOperation",
            params: [
                (0, deepHexlify_1.deepHexlify)(userOperation),
                entryPoint
            ]
        });
        return userOperationHash;
    }
    catch (err) {
        throw (0, getSendUserOperationError_1.getSendUserOperationError)(err, args);
    }
};
exports.sendUserOperation = sendUserOperation;
//# sourceMappingURL=sendUserOperation.js.map