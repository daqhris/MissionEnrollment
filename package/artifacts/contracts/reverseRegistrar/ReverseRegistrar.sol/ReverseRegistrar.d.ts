// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { AbiParameterToPrimitiveType, GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface ReverseRegistrar$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "ReverseRegistrar",
  "sourceName": "contracts/reverseRegistrar/ReverseRegistrar.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "contract ENS",
          "name": "ensAddr",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "controller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "ControllerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "contract NameResolver",
          "name": "resolver",
          "type": "address"
        }
      ],
      "name": "DefaultResolverChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        }
      ],
      "name": "ReverseClaimed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "claim",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "resolver",
          "type": "address"
        }
      ],
      "name": "claimForAddr",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "resolver",
          "type": "address"
        }
      ],
      "name": "claimWithResolver",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "controllers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultResolver",
      "outputs": [
        {
          "internalType": "contract NameResolver",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ens",
      "outputs": [
        {
          "internalType": "contract ENS",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "node",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "controller",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "setController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "resolver",
          "type": "address"
        }
      ],
      "name": "setDefaultResolver",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "setName",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "resolver",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "setNameForAddr",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x60a060405234801561001057600080fd5b5060405162000f5338038062000f53833981016040819052610031916101b6565b61003a3361014e565b6001600160a01b03811660808190526040516302571be360e01b81527f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e26004820152600091906302571be390602401602060405180830381865afa1580156100a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100ca91906101b6565b90506001600160a01b0381161561014757604051630f41a04d60e11b81523360048201526001600160a01b03821690631e83409a906024016020604051808303816000875af1158015610121573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014591906101da565b505b50506101f3565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146101b357600080fd5b50565b6000602082840312156101c857600080fd5b81516101d38161019e565b9392505050565b6000602082840312156101ec57600080fd5b5051919050565b608051610d366200021d6000396000818161012d015281816102f001526105070152610d366000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80638da5cb5b1161008c578063c66485b211610066578063c66485b2146101e1578063da8c229e146101f4578063e0dba60f14610227578063f2fde38b1461023a57600080fd5b80638da5cb5b146101aa578063bffbe61c146101bb578063c47f0027146101ce57600080fd5b806365669631116100c85780636566963114610167578063715018a61461017a5780637a806d6b14610184578063828eab0e1461019757600080fd5b80630f5a5466146100ef5780631e83409a146101155780633f15457f14610128575b600080fd5b6101026100fd366004610a25565b61024d565b6040519081526020015b60405180910390f35b610102610123366004610a5e565b610261565b61014f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161010c565b610102610175366004610a7b565b610283565b61018261056e565b005b610102610192366004610b82565b610582565b60025461014f906001600160a01b031681565b6000546001600160a01b031661014f565b6101026101c9366004610a5e565b610616565b6101026101dc366004610bf7565b610671565b6101826101ef366004610a5e565b61068e565b610217610202366004610a5e565b60016020526000908152604090205460ff1681565b604051901515815260200161010c565b610182610235366004610c42565b610769565b610182610248366004610a5e565b6107d0565b600061025a338484610283565b9392505050565b60025460009061027d90339084906001600160a01b0316610283565b92915050565b6000836001600160a01b0381163314806102ac57503360009081526001602052604090205460ff165b8061035b57506040517fe985e9c50000000000000000000000000000000000000000000000000000000081526001600160a01b0382811660048301523360248301527f0000000000000000000000000000000000000000000000000000000000000000169063e985e9c590604401602060405180830381865afa158015610337573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035b9190610c70565b8061036a575061036a81610860565b6104075760405162461bcd60e51b815260206004820152605b60248201527f526576657273655265676973747261723a2043616c6c6572206973206e6f742060448201527f6120636f6e74726f6c6c6572206f7220617574686f726973656420627920616460648201527f6472657373206f7220746865206164647265737320697473656c660000000000608482015260a4015b60405180910390fd5b6000610412866108d9565b604080517f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2602080830191909152818301849052825180830384018152606090920192839052815191012091925081906001600160a01b038916907f6ada868dd3058cf77a48a74489fd7963688e5464b2b0fa957ace976243270e9290600090a36040517f5ef2c7f00000000000000000000000000000000000000000000000000000000081527f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e26004820152602481018390526001600160a01b0387811660448301528681166064830152600060848301527f00000000000000000000000000000000000000000000000000000000000000001690635ef2c7f09060a401600060405180830381600087803b15801561054b57600080fd5b505af115801561055f573d6000803e3d6000fd5b50929998505050505050505050565b610576610959565b61058060006109b3565b565b600080610590868686610283565b6040517f773722130000000000000000000000000000000000000000000000000000000081529091506001600160a01b038516906377372213906105da9084908790600401610c8d565b600060405180830381600087803b1580156105f457600080fd5b505af1158015610608573d6000803e3d6000fd5b509298975050505050505050565b60007f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2610642836108d9565b604080516020810193909352820152606001604051602081830303815290604052805190602001209050919050565b60025460009061027d90339081906001600160a01b031685610582565b610696610959565b6001600160a01b0381166107125760405162461bcd60e51b815260206004820152603060248201527f526576657273655265676973747261723a205265736f6c76657220616464726560448201527f7373206d757374206e6f7420626520300000000000000000000000000000000060648201526084016103fe565b6002805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040517feae17a84d9eb83d8c8eb317f9e7d64857bc363fa51674d996c023f4340c577cf90600090a250565b610771610959565b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f4c97694570a07277810af7e5669ffd5f6a2d6b74b6e9a274b8b870fd5114cf87910160405180910390a25050565b6107d8610959565b6001600160a01b0381166108545760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016103fe565b61085d816109b3565b50565b6000816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa9250505080156108bc575060408051601f3d908101601f191682019092526108b991810190610ce3565b60015b6108c857506000919050565b6001600160a01b0316331492915050565b600060285b801561094d57600019017f3031323334353637383961626364656600000000000000000000000000000000600f84161a8153601090920491600019017f3031323334353637383961626364656600000000000000000000000000000000600f84161a81536010830492506108de565b50506028600020919050565b6000546001600160a01b031633146105805760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103fe565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461085d57600080fd5b60008060408385031215610a3857600080fd5b8235610a4381610a10565b91506020830135610a5381610a10565b809150509250929050565b600060208284031215610a7057600080fd5b813561025a81610a10565b600080600060608486031215610a9057600080fd5b8335610a9b81610a10565b92506020840135610aab81610a10565b91506040840135610abb81610a10565b809150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112610b0657600080fd5b813567ffffffffffffffff80821115610b2157610b21610ac6565b604051601f8301601f19908116603f01168101908282118183101715610b4957610b49610ac6565b81604052838152866020858801011115610b6257600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060808587031215610b9857600080fd5b8435610ba381610a10565b93506020850135610bb381610a10565b92506040850135610bc381610a10565b9150606085013567ffffffffffffffff811115610bdf57600080fd5b610beb87828801610af5565b91505092959194509250565b600060208284031215610c0957600080fd5b813567ffffffffffffffff811115610c2057600080fd5b610c2c84828501610af5565b949350505050565b801515811461085d57600080fd5b60008060408385031215610c5557600080fd5b8235610c6081610a10565b91506020830135610a5381610c34565b600060208284031215610c8257600080fd5b815161025a81610c34565b82815260006020604081840152835180604085015260005b81811015610cc157858101830151858201606001528201610ca5565b506000606082860101526060601f19601f830116850101925050509392505050565b600060208284031215610cf557600080fd5b815161025a81610a1056fea2646970667358221220ae53125b2634481a6d972bc36e00b857e67336ad4c6d7ce125242074bb202a7864736f6c63430008110033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100ea5760003560e01c80638da5cb5b1161008c578063c66485b211610066578063c66485b2146101e1578063da8c229e146101f4578063e0dba60f14610227578063f2fde38b1461023a57600080fd5b80638da5cb5b146101aa578063bffbe61c146101bb578063c47f0027146101ce57600080fd5b806365669631116100c85780636566963114610167578063715018a61461017a5780637a806d6b14610184578063828eab0e1461019757600080fd5b80630f5a5466146100ef5780631e83409a146101155780633f15457f14610128575b600080fd5b6101026100fd366004610a25565b61024d565b6040519081526020015b60405180910390f35b610102610123366004610a5e565b610261565b61014f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161010c565b610102610175366004610a7b565b610283565b61018261056e565b005b610102610192366004610b82565b610582565b60025461014f906001600160a01b031681565b6000546001600160a01b031661014f565b6101026101c9366004610a5e565b610616565b6101026101dc366004610bf7565b610671565b6101826101ef366004610a5e565b61068e565b610217610202366004610a5e565b60016020526000908152604090205460ff1681565b604051901515815260200161010c565b610182610235366004610c42565b610769565b610182610248366004610a5e565b6107d0565b600061025a338484610283565b9392505050565b60025460009061027d90339084906001600160a01b0316610283565b92915050565b6000836001600160a01b0381163314806102ac57503360009081526001602052604090205460ff165b8061035b57506040517fe985e9c50000000000000000000000000000000000000000000000000000000081526001600160a01b0382811660048301523360248301527f0000000000000000000000000000000000000000000000000000000000000000169063e985e9c590604401602060405180830381865afa158015610337573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035b9190610c70565b8061036a575061036a81610860565b6104075760405162461bcd60e51b815260206004820152605b60248201527f526576657273655265676973747261723a2043616c6c6572206973206e6f742060448201527f6120636f6e74726f6c6c6572206f7220617574686f726973656420627920616460648201527f6472657373206f7220746865206164647265737320697473656c660000000000608482015260a4015b60405180910390fd5b6000610412866108d9565b604080517f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2602080830191909152818301849052825180830384018152606090920192839052815191012091925081906001600160a01b038916907f6ada868dd3058cf77a48a74489fd7963688e5464b2b0fa957ace976243270e9290600090a36040517f5ef2c7f00000000000000000000000000000000000000000000000000000000081527f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e26004820152602481018390526001600160a01b0387811660448301528681166064830152600060848301527f00000000000000000000000000000000000000000000000000000000000000001690635ef2c7f09060a401600060405180830381600087803b15801561054b57600080fd5b505af115801561055f573d6000803e3d6000fd5b50929998505050505050505050565b610576610959565b61058060006109b3565b565b600080610590868686610283565b6040517f773722130000000000000000000000000000000000000000000000000000000081529091506001600160a01b038516906377372213906105da9084908790600401610c8d565b600060405180830381600087803b1580156105f457600080fd5b505af1158015610608573d6000803e3d6000fd5b509298975050505050505050565b60007f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2610642836108d9565b604080516020810193909352820152606001604051602081830303815290604052805190602001209050919050565b60025460009061027d90339081906001600160a01b031685610582565b610696610959565b6001600160a01b0381166107125760405162461bcd60e51b815260206004820152603060248201527f526576657273655265676973747261723a205265736f6c76657220616464726560448201527f7373206d757374206e6f7420626520300000000000000000000000000000000060648201526084016103fe565b6002805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040517feae17a84d9eb83d8c8eb317f9e7d64857bc363fa51674d996c023f4340c577cf90600090a250565b610771610959565b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f4c97694570a07277810af7e5669ffd5f6a2d6b74b6e9a274b8b870fd5114cf87910160405180910390a25050565b6107d8610959565b6001600160a01b0381166108545760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016103fe565b61085d816109b3565b50565b6000816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa9250505080156108bc575060408051601f3d908101601f191682019092526108b991810190610ce3565b60015b6108c857506000919050565b6001600160a01b0316331492915050565b600060285b801561094d57600019017f3031323334353637383961626364656600000000000000000000000000000000600f84161a8153601090920491600019017f3031323334353637383961626364656600000000000000000000000000000000600f84161a81536010830492506108de565b50506028600020919050565b6000546001600160a01b031633146105805760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103fe565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461085d57600080fd5b60008060408385031215610a3857600080fd5b8235610a4381610a10565b91506020830135610a5381610a10565b809150509250929050565b600060208284031215610a7057600080fd5b813561025a81610a10565b600080600060608486031215610a9057600080fd5b8335610a9b81610a10565b92506020840135610aab81610a10565b91506040840135610abb81610a10565b809150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112610b0657600080fd5b813567ffffffffffffffff80821115610b2157610b21610ac6565b604051601f8301601f19908116603f01168101908282118183101715610b4957610b49610ac6565b81604052838152866020858801011115610b6257600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060808587031215610b9857600080fd5b8435610ba381610a10565b93506020850135610bb381610a10565b92506040850135610bc381610a10565b9150606085013567ffffffffffffffff811115610bdf57600080fd5b610beb87828801610af5565b91505092959194509250565b600060208284031215610c0957600080fd5b813567ffffffffffffffff811115610c2057600080fd5b610c2c84828501610af5565b949350505050565b801515811461085d57600080fd5b60008060408385031215610c5557600080fd5b8235610c6081610a10565b91506020830135610a5381610c34565b600060208284031215610c8257600080fd5b815161025a81610c34565b82815260006020604081840152835180604085015260005b81811015610cc157858101830151858201606001528201610ca5565b506000606082860101526060601f19601f830116850101925050509392505050565b600060208284031215610cf557600080fd5b815161025a81610a1056fea2646970667358221220ae53125b2634481a6d972bc36e00b857e67336ad4c6d7ce125242074bb202a7864736f6c63430008110033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "ReverseRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ReverseRegistrar$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/reverseRegistrar/ReverseRegistrar.sol:ReverseRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<ReverseRegistrar$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "ReverseRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ReverseRegistrar$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/reverseRegistrar/ReverseRegistrar.sol:ReverseRegistrar",
    constructorArgs: [ensAddr: AbiParameterToPrimitiveType<{"name":"ensAddr","type":"address"}>],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<ReverseRegistrar$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "ReverseRegistrar",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ReverseRegistrar$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/reverseRegistrar/ReverseRegistrar.sol:ReverseRegistrar",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<ReverseRegistrar$Type["abi"]>>;
}