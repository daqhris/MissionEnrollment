// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { SignedMath$Type } from "./SignedMath";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["SignedMath"]: SignedMath$Type;
    ["@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath"]: SignedMath$Type;
  }

  interface ContractTypesMap {
    ["SignedMath"]: GetContractReturnType<SignedMath$Type["abi"]>;
    ["@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath"]: GetContractReturnType<SignedMath$Type["abi"]>;
  }
}