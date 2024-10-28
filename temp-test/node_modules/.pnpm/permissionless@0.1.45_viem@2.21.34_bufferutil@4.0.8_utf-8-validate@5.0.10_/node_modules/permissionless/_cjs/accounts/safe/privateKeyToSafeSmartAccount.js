"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyToSafeSmartAccount = void 0;
const accounts_1 = require("viem/accounts");
const signerToSafeSmartAccount_1 = require("./signerToSafeSmartAccount.js");
async function privateKeyToSafeSmartAccount(client, { privateKey, ...rest }) {
    const privateKeyAccount = (0, accounts_1.privateKeyToAccount)(privateKey);
    return (0, signerToSafeSmartAccount_1.signerToSafeSmartAccount)(client, {
        signer: privateKeyAccount,
        ...rest
    });
}
exports.privateKeyToSafeSmartAccount = privateKeyToSafeSmartAccount;
//# sourceMappingURL=privateKeyToSafeSmartAccount.js.map