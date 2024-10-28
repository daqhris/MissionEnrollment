"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerToSmartAccountSigner = void 0;
const viem_1 = require("viem");
const walletClientToSmartAccountSigner_1 = require("./walletClientToSmartAccountSigner.js");
const providerToSmartAccountSigner = async (provider, params) => {
    let account;
    if (!params) {
        try {
            ;
            [account] = await provider.request({
                method: "eth_requestAccounts"
            });
        }
        catch {
            ;
            [account] = await provider.request({
                method: "eth_accounts"
            });
        }
    }
    else {
        account = params.signerAddress;
    }
    const walletClient = (0, viem_1.createWalletClient)({
        account: account,
        transport: (0, viem_1.custom)(provider)
    });
    return (0, walletClientToSmartAccountSigner_1.walletClientToSmartAccountSigner)(walletClient);
};
exports.providerToSmartAccountSigner = providerToSmartAccountSigner;
//# sourceMappingURL=providerToSmartAccountSigner.js.map