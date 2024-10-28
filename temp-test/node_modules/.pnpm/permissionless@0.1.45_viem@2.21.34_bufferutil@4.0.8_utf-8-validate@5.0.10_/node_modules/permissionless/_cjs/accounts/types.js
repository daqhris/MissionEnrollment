"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignTransactionNotSupportedBySmartAccount = void 0;
const viem_1 = require("viem");
class SignTransactionNotSupportedBySmartAccount extends viem_1.BaseError {
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
exports.SignTransactionNotSupportedBySmartAccount = SignTransactionNotSupportedBySmartAccount;
//# sourceMappingURL=types.js.map