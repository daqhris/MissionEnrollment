// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { ReverseClaimer$Type } from "./ReverseClaimer";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["ReverseClaimer"]: ReverseClaimer$Type;
    ["contracts/reverseRegistrar/ReverseClaimer.sol:ReverseClaimer"]: ReverseClaimer$Type;
  }

  interface ContractTypesMap {
    ["ReverseClaimer"]: GetContractReturnType<ReverseClaimer$Type["abi"]>;
    ["contracts/reverseRegistrar/ReverseClaimer.sol:ReverseClaimer"]: GetContractReturnType<ReverseClaimer$Type["abi"]>;
  }
}