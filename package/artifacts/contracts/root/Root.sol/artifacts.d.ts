// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { Root$Type } from "./Root";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["Root"]: Root$Type;
    ["contracts/root/Root.sol:Root"]: Root$Type;
  }

  interface ContractTypesMap {
    ["Root"]: GetContractReturnType<Root$Type["abi"]>;
    ["contracts/root/Root.sol:Root"]: GetContractReturnType<Root$Type["abi"]>;
  }
}