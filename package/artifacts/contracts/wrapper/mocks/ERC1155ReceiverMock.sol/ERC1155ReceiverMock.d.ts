// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { AbiParameterToPrimitiveType, GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface ERC1155ReceiverMock$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "ERC1155ReceiverMock",
  "sourceName": "contracts/wrapper/mocks/ERC1155ReceiverMock.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "recRetval",
          "type": "bytes4"
        },
        {
          "internalType": "bool",
          "name": "recReverts",
          "type": "bool"
        },
        {
          "internalType": "bytes4",
          "name": "batRetval",
          "type": "bytes4"
        },
        {
          "internalType": "bool",
          "name": "batReverts",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "BatchReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "Received",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "onERC1155BatchReceived",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "onERC1155Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b5060405161078838038061078883398101604081905261002f916100bd565b6000805491151569010000000000000000000260ff60481b1960e094851c65010000000000021664ffffffffff60281b199515156401000000000264ffffffffff199094169690941c95909517919091179290921617919091179055610111565b80516001600160e01b0319811681146100a857600080fd5b919050565b805180151581146100a857600080fd5b600080600080608085870312156100d357600080fd5b6100dc85610090565b93506100ea602086016100ad565b92506100f860408601610090565b9150610106606086016100ad565b905092959194509250565b610668806101206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806301ffc9a714610046578063bc197c81146100b0578063f23a6e61146100f4575b600080fd5b61009b6100543660046102c8565b7fffffffff00000000000000000000000000000000000000000000000000000000167f01ffc9a7000000000000000000000000000000000000000000000000000000001490565b60405190151581526020015b60405180910390f35b6100c36100be3660046103c8565b610107565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016100a7565b6100c3610102366004610483565b6101f4565b600080546901000000000000000000900460ff16156101935760405162461bcd60e51b815260206004820152602f60248201527f4552433131353552656365697665724d6f636b3a20726576657274696e67206f60448201527f6e2062617463682072656365697665000000000000000000000000000000000060648201526084015b60405180910390fd5b7f9facaeece8596899cc39b65f0d1e262008ade8403076a2dfb6df2004fc8d965289898989898989896040516101d098979695949392919061056f565b60405180910390a15060005465010000000000900460e01b98975050505050505050565b60008054640100000000900460ff16156102765760405162461bcd60e51b815260206004820152602960248201527f4552433131353552656365697665724d6f636b3a20726576657274696e67206f60448201527f6e20726563656976650000000000000000000000000000000000000000000000606482015260840161018a565b7fe4b060c773f3fcca980bf840b0e2856ca36598bb4da2c0c3913b89050630df378787878787876040516102af969594939291906105e0565b60405180910390a15060005460e01b9695505050505050565b6000602082840312156102da57600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461030a57600080fd5b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461033557600080fd5b919050565b60008083601f84011261034c57600080fd5b50813567ffffffffffffffff81111561036457600080fd5b6020830191508360208260051b850101111561037f57600080fd5b9250929050565b60008083601f84011261039857600080fd5b50813567ffffffffffffffff8111156103b057600080fd5b60208301915083602082850101111561037f57600080fd5b60008060008060008060008060a0898b0312156103e457600080fd5b6103ed89610311565b97506103fb60208a01610311565b9650604089013567ffffffffffffffff8082111561041857600080fd5b6104248c838d0161033a565b909850965060608b013591508082111561043d57600080fd5b6104498c838d0161033a565b909650945060808b013591508082111561046257600080fd5b5061046f8b828c01610386565b999c989b5096995094979396929594505050565b60008060008060008060a0878903121561049c57600080fd5b6104a587610311565b95506104b360208801610311565b94506040870135935060608701359250608087013567ffffffffffffffff8111156104dd57600080fd5b6104e989828a01610386565b979a9699509497509295939492505050565b81835260007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83111561052d57600080fd5b8260051b80836020870137939093016020019392505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b600073ffffffffffffffffffffffffffffffffffffffff808b168352808a1660208401525060a060408301526105a960a08301888a6104fb565b82810360608401526105bc8187896104fb565b905082810360808401526105d1818587610546565b9b9a5050505050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff808916835280881660208401525085604083015284606083015260a0608083015261062660a083018486610546565b9897505050505050505056fea2646970667358221220a3c8ebc0ae6efde3dccf84cfa1509ee60959687790d2fdff0665fb987981733064736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c806301ffc9a714610046578063bc197c81146100b0578063f23a6e61146100f4575b600080fd5b61009b6100543660046102c8565b7fffffffff00000000000000000000000000000000000000000000000000000000167f01ffc9a7000000000000000000000000000000000000000000000000000000001490565b60405190151581526020015b60405180910390f35b6100c36100be3660046103c8565b610107565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016100a7565b6100c3610102366004610483565b6101f4565b600080546901000000000000000000900460ff16156101935760405162461bcd60e51b815260206004820152602f60248201527f4552433131353552656365697665724d6f636b3a20726576657274696e67206f60448201527f6e2062617463682072656365697665000000000000000000000000000000000060648201526084015b60405180910390fd5b7f9facaeece8596899cc39b65f0d1e262008ade8403076a2dfb6df2004fc8d965289898989898989896040516101d098979695949392919061056f565b60405180910390a15060005465010000000000900460e01b98975050505050505050565b60008054640100000000900460ff16156102765760405162461bcd60e51b815260206004820152602960248201527f4552433131353552656365697665724d6f636b3a20726576657274696e67206f60448201527f6e20726563656976650000000000000000000000000000000000000000000000606482015260840161018a565b7fe4b060c773f3fcca980bf840b0e2856ca36598bb4da2c0c3913b89050630df378787878787876040516102af969594939291906105e0565b60405180910390a15060005460e01b9695505050505050565b6000602082840312156102da57600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461030a57600080fd5b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461033557600080fd5b919050565b60008083601f84011261034c57600080fd5b50813567ffffffffffffffff81111561036457600080fd5b6020830191508360208260051b850101111561037f57600080fd5b9250929050565b60008083601f84011261039857600080fd5b50813567ffffffffffffffff8111156103b057600080fd5b60208301915083602082850101111561037f57600080fd5b60008060008060008060008060a0898b0312156103e457600080fd5b6103ed89610311565b97506103fb60208a01610311565b9650604089013567ffffffffffffffff8082111561041857600080fd5b6104248c838d0161033a565b909850965060608b013591508082111561043d57600080fd5b6104498c838d0161033a565b909650945060808b013591508082111561046257600080fd5b5061046f8b828c01610386565b999c989b5096995094979396929594505050565b60008060008060008060a0878903121561049c57600080fd5b6104a587610311565b95506104b360208801610311565b94506040870135935060608701359250608087013567ffffffffffffffff8111156104dd57600080fd5b6104e989828a01610386565b979a9699509497509295939492505050565b81835260007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83111561052d57600080fd5b8260051b80836020870137939093016020019392505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b600073ffffffffffffffffffffffffffffffffffffffff808b168352808a1660208401525060a060408301526105a960a08301888a6104fb565b82810360608401526105bc8187896104fb565b905082810360808401526105d1818587610546565b9b9a5050505050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff808916835280881660208401525085604083015284606083015260a0608083015261062660a083018486610546565b9897505050505050505056fea2646970667358221220a3c8ebc0ae6efde3dccf84cfa1509ee60959687790d2fdff0665fb987981733064736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "ERC1155ReceiverMock",
    constructorArgs: [recRetval: AbiParameterToPrimitiveType<{"name":"recRetval","type":"bytes4"}>, recReverts: AbiParameterToPrimitiveType<{"name":"recReverts","type":"bool"}>, batRetval: AbiParameterToPrimitiveType<{"name":"batRetval","type":"bytes4"}>, batReverts: AbiParameterToPrimitiveType<{"name":"batReverts","type":"bool"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/wrapper/mocks/ERC1155ReceiverMock.sol:ERC1155ReceiverMock",
    constructorArgs: [recRetval: AbiParameterToPrimitiveType<{"name":"recRetval","type":"bytes4"}>, recReverts: AbiParameterToPrimitiveType<{"name":"recReverts","type":"bool"}>, batRetval: AbiParameterToPrimitiveType<{"name":"batRetval","type":"bytes4"}>, batReverts: AbiParameterToPrimitiveType<{"name":"batReverts","type":"bool"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "ERC1155ReceiverMock",
    constructorArgs: [recRetval: AbiParameterToPrimitiveType<{"name":"recRetval","type":"bytes4"}>, recReverts: AbiParameterToPrimitiveType<{"name":"recReverts","type":"bool"}>, batRetval: AbiParameterToPrimitiveType<{"name":"batRetval","type":"bytes4"}>, batReverts: AbiParameterToPrimitiveType<{"name":"batReverts","type":"bool"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/wrapper/mocks/ERC1155ReceiverMock.sol:ERC1155ReceiverMock",
    constructorArgs: [recRetval: AbiParameterToPrimitiveType<{"name":"recRetval","type":"bytes4"}>, recReverts: AbiParameterToPrimitiveType<{"name":"recReverts","type":"bool"}>, batRetval: AbiParameterToPrimitiveType<{"name":"batRetval","type":"bytes4"}>, batReverts: AbiParameterToPrimitiveType<{"name":"batReverts","type":"bool"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "ERC1155ReceiverMock",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/wrapper/mocks/ERC1155ReceiverMock.sol:ERC1155ReceiverMock",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ERC1155ReceiverMock$Type["abi"]>>;
}