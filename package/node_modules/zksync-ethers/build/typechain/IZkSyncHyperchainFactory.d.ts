import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IZkSyncHyperchain } from "./IZkSyncHyperchain";
export declare class IZkSyncHyperchainFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): IZkSyncHyperchain;
}
