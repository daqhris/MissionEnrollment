// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { StaticBulkRenewal$Type } from "./StaticBulkRenewal";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["StaticBulkRenewal"]: StaticBulkRenewal$Type;
    ["contracts/ethregistrar/StaticBulkRenewal.sol:StaticBulkRenewal"]: StaticBulkRenewal$Type;
  }

  interface ContractTypesMap {
    ["StaticBulkRenewal"]: GetContractReturnType<StaticBulkRenewal$Type["abi"]>;
    ["contracts/ethregistrar/StaticBulkRenewal.sol:StaticBulkRenewal"]: GetContractReturnType<StaticBulkRenewal$Type["abi"]>;
  }
}