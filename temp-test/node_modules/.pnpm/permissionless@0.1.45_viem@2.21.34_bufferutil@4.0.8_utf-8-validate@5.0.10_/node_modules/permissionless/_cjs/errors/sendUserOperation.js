"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendUserOperationError = void 0;
const viem_1 = require("viem");
const utils_1 = require("./utils.js");
class SendUserOperationError extends viem_1.BaseError {
    constructor(cause, { userOperation, entryPoint, docsPath }) {
        const prettyArgs = (0, utils_1.prettyPrint)({
            ...userOperation,
            entryPoint
        });
        super(cause.shortMessage, {
            cause,
            docsPath,
            metaMessages: [
                ...(cause.metaMessages ? [...cause.metaMessages, " "] : []),
                "sendUserOperation Arguments:",
                prettyArgs
            ].filter(Boolean)
        });
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SendUserOperationError"
        });
        this.cause = cause;
    }
}
exports.SendUserOperationError = SendUserOperationError;
//# sourceMappingURL=sendUserOperation.js.map