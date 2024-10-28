import { BaseError } from "viem";
export class SignTransactionNotSupportedBySmartAccount extends BaseError {
    constructor({ docsPath } = {}) {
        super([
            "A smart account cannot sign or send transaction, it can only sign message or userOperation.",
            "Please send user operation instead."
        ].join("\n"), {
            docsPath,
            docsSlug: "account"
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SignTransactionNotSupportedBySmartAccount"
        });
    }
}
//# sourceMappingURL=types.js.map