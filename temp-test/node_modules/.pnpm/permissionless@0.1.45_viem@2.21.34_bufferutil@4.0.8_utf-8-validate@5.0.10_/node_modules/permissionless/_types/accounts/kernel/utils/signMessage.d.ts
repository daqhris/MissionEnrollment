import { type Account, type Chain, type Client, type SignMessageParameters, type SignMessageReturnType, type Transport } from "viem";
import { type WrapMessageHashParams } from "./wrapMessageHash";
export declare function signMessage<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: Client<Transport, TChain, TAccount>, { account: account_, message, accountAddress, accountVersion }: SignMessageParameters<TAccount> & WrapMessageHashParams): Promise<SignMessageReturnType>;
//# sourceMappingURL=signMessage.d.ts.map