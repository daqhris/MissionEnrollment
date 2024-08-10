// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { AbiParameterToPrimitiveType, GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface DummyProxyRegistry$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "DummyProxyRegistry",
  "sourceName": "contracts/ethregistrar/mocks/DummyProxyRegistry.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_target",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "a",
          "type": "address"
        }
      ],
      "name": "proxies",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b5060405161018138038061018183398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b60ef806100926000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063c455279114602d575b600080fd5b60556038366004607e565b5060005473ffffffffffffffffffffffffffffffffffffffff1690565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b600060208284031215608f57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811460b257600080fd5b939250505056fea2646970667358221220ff5ce1e0c24cada5d2ba169041e990a09ebe55df52e71fc34494abb2f8b53cee64736f6c63430008110033",
  "deployedBytecode": "0x6080604052348015600f57600080fd5b506004361060285760003560e01c8063c455279114602d575b600080fd5b60556038366004607e565b5060005473ffffffffffffffffffffffffffffffffffffffff1690565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b600060208284031215608f57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811460b257600080fd5b939250505056fea2646970667358221220ff5ce1e0c24cada5d2ba169041e990a09ebe55df52e71fc34494abb2f8b53cee64736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "DummyProxyRegistry",
    constructorArgs: [_target: AbiParameterToPrimitiveType<{"name":"_target","type":"address"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<DummyProxyRegistry$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/ethregistrar/mocks/DummyProxyRegistry.sol:DummyProxyRegistry",
    constructorArgs: [_target: AbiParameterToPrimitiveType<{"name":"_target","type":"address"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<DummyProxyRegistry$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "DummyProxyRegistry",
    constructorArgs: [_target: AbiParameterToPrimitiveType<{"name":"_target","type":"address"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<DummyProxyRegistry$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/ethregistrar/mocks/DummyProxyRegistry.sol:DummyProxyRegistry",
    constructorArgs: [_target: AbiParameterToPrimitiveType<{"name":"_target","type":"address"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<DummyProxyRegistry$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "DummyProxyRegistry",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<DummyProxyRegistry$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/ethregistrar/mocks/DummyProxyRegistry.sol:DummyProxyRegistry",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<DummyProxyRegistry$Type["abi"]>>;
}