import type { Account, Address, Chain, Transport, WalletClient } from "viem";
import type { SmartAccountSigner } from "../accounts/types";
export declare function walletClientToSmartAccountSigner<TChain extends Chain | undefined = Chain | undefined>(walletClient: WalletClient<Transport, TChain, Account>): SmartAccountSigner<"custom", Address>;
//# sourceMappingURL=walletClientToSmartAccountSigner.d.ts.map