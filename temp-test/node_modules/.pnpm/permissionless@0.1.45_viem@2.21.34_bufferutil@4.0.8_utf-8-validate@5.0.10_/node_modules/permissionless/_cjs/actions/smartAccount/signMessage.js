"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMessage = void 0;
const utils_1 = require("../../utils/index.js");
async function signMessage(client, { account: account_ = client.account, message }) {
    if (!account_)
        throw new utils_1.AccountOrClientNotFoundError({
            docsPath: "/docs/actions/wallet/signMessage"
        });
    const account = (0, utils_1.parseAccount)(account_);
    if (account.type === "local")
        return account.signMessage({ message });
    throw new Error("Sign message is not supported by this account");
}
exports.signMessage = signMessage;
//# sourceMappingURL=signMessage.js.map