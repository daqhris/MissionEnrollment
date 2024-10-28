"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletClientToSmartAccountSigner = void 0;
const actions_1 = require("viem/actions");
function walletClientToSmartAccountSigner(walletClient) {
    return {
        address: walletClient.account.address,
        type: "local",
        source: "custom",
        publicKey: walletClient.account.address,
        signMessage: async ({ message }) => {
            return walletClient.signMessage({ message });
        },
        async signTypedData(typedData) {
            return (0, actions_1.signTypedData)(walletClient, {
                account: walletClient.account,
                ...typedData
            });
        }
    };
}
exports.walletClientToSmartAccountSigner = walletClientToSmartAccountSigner;
//# sourceMappingURL=walletClientToSmartAccountSigner.js.map