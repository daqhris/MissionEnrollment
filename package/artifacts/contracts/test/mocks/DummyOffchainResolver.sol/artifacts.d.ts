// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { DummyOffchainResolver$Type } from "./DummyOffchainResolver";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["DummyOffchainResolver"]: DummyOffchainResolver$Type;
    ["contracts/test/mocks/DummyOffchainResolver.sol:DummyOffchainResolver"]: DummyOffchainResolver$Type;
  }

  interface ContractTypesMap {
    ["DummyOffchainResolver"]: GetContractReturnType<DummyOffchainResolver$Type["abi"]>;
    ["contracts/test/mocks/DummyOffchainResolver.sol:DummyOffchainResolver"]: GetContractReturnType<DummyOffchainResolver$Type["abi"]>;
  }
}