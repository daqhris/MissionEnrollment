import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Il1Messenger } from "./Il1Messenger";
export declare class Il1MessengerFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): Il1Messenger;
}
