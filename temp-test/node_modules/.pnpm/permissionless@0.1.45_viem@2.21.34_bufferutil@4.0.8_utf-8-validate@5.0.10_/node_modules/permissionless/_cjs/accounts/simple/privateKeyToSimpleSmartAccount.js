"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyToSimpleSmartAccount = void 0;
const accounts_1 = require("viem/accounts");
const signerToSimpleSmartAccount_1 = require("./signerToSimpleSmartAccount.js");
async function privateKeyToSimpleSmartAccount(client, { privateKey, ...rest }) {
    const privateKeyAccount = (0, accounts_1.privateKeyToAccount)(privateKey);
    return (0, signerToSimpleSmartAccount_1.signerToSimpleSmartAccount)(client, {
        signer: privateKeyAccount,
        ...rest
    });
}
exports.privateKeyToSimpleSmartAccount = privateKeyToSimpleSmartAccount;
//# sourceMappingURL=privateKeyToSimpleSmartAccount.js.map