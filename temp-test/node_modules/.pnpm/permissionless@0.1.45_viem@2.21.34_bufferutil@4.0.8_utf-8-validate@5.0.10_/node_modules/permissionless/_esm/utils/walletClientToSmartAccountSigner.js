import { signTypedData } from "viem/actions";
export function walletClientToSmartAccountSigner(walletClient) {
    return {
        address: walletClient.account.address,
        type: "local",
        source: "custom",
        publicKey: walletClient.account.address,
        signMessage: async ({ message }) => {
            return walletClient.signMessage({ message });
        },
        async signTypedData(typedData) {
            return signTypedData(walletClient, {
                account: walletClient.account,
                ...typedData
            });
        }
    };
}
//# sourceMappingURL=walletClientToSmartAccountSigner.js.map