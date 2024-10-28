"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyToBiconomySmartAccount = void 0;
const accounts_1 = require("viem/accounts");
const signerToBiconomySmartAccount_1 = require("./signerToBiconomySmartAccount.js");
async function privateKeyToBiconomySmartAccount(client, { privateKey, ...rest }) {
    const privateKeyAccount = (0, accounts_1.privateKeyToAccount)(privateKey);
    return (0, signerToBiconomySmartAccount_1.signerToBiconomySmartAccount)(client, {
        signer: privateKeyAccount,
        ...rest
    });
}
exports.privateKeyToBiconomySmartAccount = privateKeyToBiconomySmartAccount;
//# sourceMappingURL=privateKeyToBiconomySmartAccount.js.map