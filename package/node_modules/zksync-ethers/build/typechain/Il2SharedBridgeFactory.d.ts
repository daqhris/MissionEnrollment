import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Il2SharedBridge } from "./Il2SharedBridge";
export declare class Il2SharedBridgeFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): Il2SharedBridge;
}
