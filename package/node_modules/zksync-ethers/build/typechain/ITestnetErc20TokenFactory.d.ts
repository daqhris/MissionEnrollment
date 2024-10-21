import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ITestnetErc20Token } from "./ITestnetErc20Token";
export declare class ITestnetErc20TokenFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): ITestnetErc20Token;
}
