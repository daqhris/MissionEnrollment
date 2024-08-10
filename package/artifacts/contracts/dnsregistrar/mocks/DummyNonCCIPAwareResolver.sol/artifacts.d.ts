// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { DummyNonCCIPAwareResolver$Type } from "./DummyNonCCIPAwareResolver";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["DummyNonCCIPAwareResolver"]: DummyNonCCIPAwareResolver$Type;
    ["contracts/dnsregistrar/mocks/DummyNonCCIPAwareResolver.sol:DummyNonCCIPAwareResolver"]: DummyNonCCIPAwareResolver$Type;
  }

  interface ContractTypesMap {
    ["DummyNonCCIPAwareResolver"]: GetContractReturnType<DummyNonCCIPAwareResolver$Type["abi"]>;
    ["contracts/dnsregistrar/mocks/DummyNonCCIPAwareResolver.sol:DummyNonCCIPAwareResolver"]: GetContractReturnType<DummyNonCCIPAwareResolver$Type["abi"]>;
  }
}