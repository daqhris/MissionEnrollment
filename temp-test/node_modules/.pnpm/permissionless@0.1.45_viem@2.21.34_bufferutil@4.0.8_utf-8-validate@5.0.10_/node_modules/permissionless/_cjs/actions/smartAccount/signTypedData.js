"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTypedData = void 0;
const viem_1 = require("viem");
const utils_1 = require("../../utils/index.js");
async function signTypedData(client, { account: account_ = client.account, domain, message, primaryType, types: types_ }) {
    if (!account_) {
        throw new utils_1.AccountOrClientNotFoundError({
            docsPath: "/docs/actions/wallet/signMessage"
        });
    }
    const account = (0, utils_1.parseAccount)(account_);
    const types = {
        EIP712Domain: (0, viem_1.getTypesForEIP712Domain)({ domain }),
        ...types_
    };
    (0, viem_1.validateTypedData)({
        domain,
        message,
        primaryType,
        types
    });
    if (account.type === "local") {
        return account.signTypedData({
            domain,
            primaryType,
            types,
            message
        });
    }
    throw new Error("Sign type message is not supported by this account");
}
exports.signTypedData = signTypedData;
//# sourceMappingURL=signTypedData.js.map