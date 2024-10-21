import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Ierc1271 } from "./Ierc1271";
export declare class Ierc1271Factory {
    static connect(address: string, signerOrProvider: Signer | Provider): Ierc1271;
}
