import { type EIP1193Provider, type Hex } from "viem";
export declare const providerToSmartAccountSigner: (provider: EIP1193Provider, params?: {
    signerAddress: Hex;
}) => Promise<import("../accounts").SmartAccountSigner<"custom", `0x${string}`>>;
//# sourceMappingURL=providerToSmartAccountSigner.d.ts.map