// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { NameWrapper$Type } from "./NameWrapper";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["NameWrapper"]: NameWrapper$Type;
    ["contracts/wrapper/NameWrapper.sol:NameWrapper"]: NameWrapper$Type;
  }

  interface ContractTypesMap {
    ["NameWrapper"]: GetContractReturnType<NameWrapper$Type["abi"]>;
    ["contracts/wrapper/NameWrapper.sol:NameWrapper"]: GetContractReturnType<NameWrapper$Type["abi"]>;
  }
}