// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { BaseRegistrarImplementation$Type } from "./BaseRegistrarImplementation";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["BaseRegistrarImplementation"]: BaseRegistrarImplementation$Type;
    ["contracts/ethregistrar/BaseRegistrarImplementation.sol:BaseRegistrarImplementation"]: BaseRegistrarImplementation$Type;
  }

  interface ContractTypesMap {
    ["BaseRegistrarImplementation"]: GetContractReturnType<BaseRegistrarImplementation$Type["abi"]>;
    ["contracts/ethregistrar/BaseRegistrarImplementation.sol:BaseRegistrarImplementation"]: GetContractReturnType<BaseRegistrarImplementation$Type["abi"]>;
  }
}