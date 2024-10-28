"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyToLightSmartAccount = void 0;
const accounts_1 = require("viem/accounts");
const signerToLightSmartAccount_1 = require("./signerToLightSmartAccount.js");
async function privateKeyToLightSmartAccount(client, { privateKey, ...rest }) {
    const privateKeyAccount = (0, accounts_1.privateKeyToAccount)(privateKey);
    return (0, signerToLightSmartAccount_1.signerToLightSmartAccount)(client, {
        signer: privateKeyAccount,
        ...rest
    });
}
exports.privateKeyToLightSmartAccount = privateKeyToLightSmartAccount;
//# sourceMappingURL=privateKeyToLightSmartAccount.js.map