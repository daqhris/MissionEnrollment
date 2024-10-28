import { BaseError } from "viem";
import { prettyPrint } from "./utils.js";
export class SendUserOperationError extends BaseError {
    constructor(cause, { userOperation, entryPoint, docsPath }) {
        const prettyArgs = prettyPrint({
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
//# sourceMappingURL=sendUserOperation.js.map