"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUserOperationHashWithECDSA = exports.AccountOrClientNotFoundError = void 0;
const viem_1 = require("viem");
const _1 = require("./index.js");
const getUserOperationHash_1 = require("./getUserOperationHash.js");
class AccountOrClientNotFoundError extends viem_1.BaseError {
    constructor({ docsPath } = {}) {
        super([
            "Could not find an Account to execute with this Action.",
            "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient."
        ].join("\n"), {
            docsPath,
            docsSlug: "account"
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AccountOrClientNotFoundError"
        });
    }
}
exports.AccountOrClientNotFoundError = AccountOrClientNotFoundError;
const signUserOperationHashWithECDSA = async ({ client, account: account_ = client?.account, hash, userOperation, chainId, entryPoint: entryPointAddress }) => {
    if (!account_)
        throw new AccountOrClientNotFoundError({
            docsPath: "/permissionless/reference/utils/signUserOperationHashWithECDSA"
        });
    let userOperationHash;
    if (hash) {
        userOperationHash = hash;
    }
    else {
        userOperationHash = (0, getUserOperationHash_1.getUserOperationHash)({
            userOperation,
            chainId,
            entryPoint: entryPointAddress
        });
    }
    const account = (0, _1.parseAccount)(account_);
    if (account.type === "local")
        return account.signMessage({
            message: {
                raw: userOperationHash
            }
        });
    if (!client)
        throw new AccountOrClientNotFoundError({
            docsPath: "/permissionless/reference/utils/signUserOperationHashWithECDSA"
        });
    return client.request({
        method: "personal_sign",
        params: [userOperationHash, account.address]
    });
};
exports.signUserOperationHashWithECDSA = signUserOperationHashWithECDSA;
//# sourceMappingURL=signUserOperationHashWithECDSA.js.map