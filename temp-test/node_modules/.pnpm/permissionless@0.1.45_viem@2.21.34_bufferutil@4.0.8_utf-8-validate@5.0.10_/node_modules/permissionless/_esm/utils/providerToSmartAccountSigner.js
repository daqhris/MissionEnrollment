import { createWalletClient, custom } from "viem";
import { walletClientToSmartAccountSigner } from "./walletClientToSmartAccountSigner.js";
export const providerToSmartAccountSigner = async (provider, params) => {
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
    const walletClient = createWalletClient({
        account: account,
        transport: custom(provider)
    });
    return walletClientToSmartAccountSigner(walletClient);
};
//# sourceMappingURL=providerToSmartAccountSigner.js.map