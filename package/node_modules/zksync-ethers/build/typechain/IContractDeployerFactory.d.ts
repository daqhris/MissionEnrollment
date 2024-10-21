import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IContractDeployer } from "./IContractDeployer";
export declare class IContractDeployerFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): IContractDeployer;
}
