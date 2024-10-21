import { TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import { PayableOverrides, Signer } from 'ethers';
import { Artifact } from 'hardhat/types';
import * as zk from 'zksync-ethers';
import { Address, Deployment, DeployOptions, ExtendedArtifact } from '../types';
export declare class DeploymentFactory {
    private factory;
    private artifact;
    private isZkSync;
    private getArtifact;
    private overrides;
    private args;
    constructor(getArtifact: (name: string) => Promise<Artifact>, artifact: Artifact | ExtendedArtifact, args: any[], network: any, ethersSigner?: Signer | zk.Signer, overrides?: PayableOverrides);
    extractFactoryDeps(artifact: any): Promise<string[]>;
    private _extractFactoryDepsRecursive;
    getDeployTransaction(): Promise<TransactionRequest>;
    private calculateEvmCreate2Address;
    private calculateZkCreate2Address;
    getCreate2Address(create2DeployerAddress: Address, create2Salt: string): Promise<Address>;
    compareDeploymentTransaction(transaction: TransactionResponse, deployment: Deployment): Promise<boolean>;
    getDeployedAddress(receipt: TransactionReceipt, options: DeployOptions, create2Address: string | undefined): string;
}
//# sourceMappingURL=DeploymentFactory.d.ts.map