// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { Buffer$Type } from "./Buffer";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["Buffer"]: Buffer$Type;
    ["@ensdomains/buffer/contracts/Buffer.sol:Buffer"]: Buffer$Type;
  }

  interface ContractTypesMap {
    ["Buffer"]: GetContractReturnType<Buffer$Type["abi"]>;
    ["@ensdomains/buffer/contracts/Buffer.sol:Buffer"]: GetContractReturnType<Buffer$Type["abi"]>;
  }
}