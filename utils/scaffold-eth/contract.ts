import type {
  Address,
  Hash,
  TransactionReceipt,
  TransactionRequest,
  PrepareTransactionRequestParameters,
  GetTransactionReceiptParameters,
  GetTransactionReceiptReturnType,
  PublicClient,
  WalletClient,
  Transport,
  Account,
  Chain,
  GetContractReturnType,
  WriteContractParameters,
  Log,
  Block,
  GetTransactionReturnType
} from "viem";
import {
  useContractRead,
  useContractWrite,
  useWatchContractEvent
} from "wagmi";
import type { Abi, ExtractAbiFunction, ExtractAbiFunctionNames, ExtractAbiEvent, ExtractAbiEventNames, AbiParameter } from "abitype";
import type { Simplify } from "type-fest";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";
import deployedContractsData from "~~/contracts/deployedContracts";
import externalContractsData from "~~/contracts/externalContracts";
import scaffoldConfig from "~~/scaffold.config";

export type TransactorFuncOptions = {
  value?: string | bigint;
  gasLimit?: string | bigint;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  blockConfirmations?: number;
  onBlockConfirmation?: (receipt: TransactionReceipt) => void;
};

type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ContractName in keyof T[ChainId]]: T[ChainId][ContractName] & { external?: true };
  };
};

const deepMergeContracts = <
  L extends Record<PropertyKey, Record<string, unknown>>,
  E extends Record<PropertyKey, Record<string, unknown>>
>(
  local: L,
  external: E,
) => {
  const result: Record<PropertyKey, Record<string, unknown>> = {};
  const allKeys = Array.from(new Set([...Object.keys(external), ...Object.keys(local)]));
  for (const key of allKeys) {
    if (!external[key]) {
      result[key] = local[key] || {};
      continue;
    }
    const amendedExternal = Object.fromEntries(
      Object.entries(external[key] || {}).map(([contractName, declaration]) => [
        contractName,
        { ...(declaration as Record<string, unknown>), external: true },
      ]),
    );
    result[key] = { ...(local[key] || {}), ...amendedExternal };
  }
  return result as MergeDeepRecord<AddExternalFlag<L>, AddExternalFlag<E>, { arrayMergeMode: "replace" }>;
};

const contractsData = deepMergeContracts(deployedContractsData, externalContractsData);

export type InheritedFunctions = { readonly [key: string]: string };

export type GenericContract = {
  address: Address;
  abi: Abi;
  inheritedFunctions?: InheritedFunctions;
  external?: true;
};

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract;
  };
};

export const contracts = contractsData as GenericContractsDeclaration | null;

type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];

type IsContractDeclarationMissing<TYes, TNo> = typeof contractsData extends { [key in ConfiguredChainId]: Record<string, GenericContract> }
  ? TNo
  : TYes;

type ContractsDeclaration = IsContractDeclarationMissing<GenericContractsDeclaration, typeof contractsData>;

type Contracts = ContractsDeclaration[ConfiguredChainId];

export type ContractName = keyof Contracts;

export type Contract<TContractName extends ContractName> = Contracts[TContractName];

type InferContractAbi<TContract> = TContract extends { abi: infer TAbi } ? TAbi : never;

export type ContractAbi<TContractName extends ContractName = ContractName> = InferContractAbi<Contract<TContractName>>;

export type AbiFunctionInputs<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["inputs"];

export type AbiFunctionArguments<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["inputs"];

export type AbiFunctionOutputs<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["outputs"];

export type AbiFunctionReturnType<TAbi extends Abi, TFunctionName extends string> = IsContractDeclarationMissing<
  unknown,
  ExtractAbiFunction<TAbi, TFunctionName>["outputs"] extends readonly [unknown]
    ? ExtractAbiFunction<TAbi, TFunctionName>["outputs"][0]
    : ExtractAbiFunction<TAbi, TFunctionName>["outputs"]
>;

export type AbiEventInputs<TAbi extends Abi, TEventName extends ExtractAbiEventNames<TAbi>> = ExtractAbiEvent<
  TAbi,
  TEventName
>["inputs"];

export enum ContractCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
}

type AbiStateMutability = "pure" | "view" | "nonpayable" | "payable";
export type ReadAbiStateMutability = "view" | "pure";
export type WriteAbiStateMutability = "nonpayable" | "payable";

export type FunctionNamesWithInputs<
  TContractName extends ContractName,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = Exclude<
  Extract<
    ContractAbi<TContractName>[number],
    {
      type: "function";
      stateMutability: TAbiStateMutibility;
    }
  >,
  {
    inputs: readonly [];
  }
>["name"];

type Expand<T> = T extends object ? (T extends infer O ? { [K in keyof O]: O[K] } : never) : T;

type UnionToIntersection<U> = Expand<(U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never>;

type OptionalTupple<T> = T extends readonly [infer H, ...infer R] ? readonly [H | undefined, ...OptionalTupple<R>] : T;

type UseScaffoldArgsParam<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>>,
> = TFunctionName extends FunctionNamesWithInputs<TContractName>
  ? {
      args: OptionalTupple<UnionToIntersection<AbiFunctionArguments<ContractAbi<TContractName>, TFunctionName>>>;
      value?: ExtractAbiFunction<ContractAbi<TContractName>, TFunctionName>["stateMutability"] extends "payable"
        ? bigint | undefined
        : undefined;
    }
  : {
      args?: never;
    };

export type UseScaffoldReadConfig<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, ReadAbiStateMutability>
> = Parameters<typeof useContractRead>[0] & {
  contractName: TContractName;
};

export type UseScaffoldWriteConfig<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, WriteAbiStateMutability>
> = Parameters<typeof useContractWrite>[0] & {
  contractName: TContractName;
};

export type UseScaffoldEventConfig<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>
> = {
  contractName: TContractName;
  eventName: TEventName;
  listener: (logs: Log[]) => void;
} & Omit<Parameters<typeof useWatchContractEvent>[0], "address" | "abi" | "eventName" | "onLogs">;

type IndexedEventInputs<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
> = Extract<AbiEventInputs<ContractAbi<TContractName>, TEventName>[number], { indexed: true }>;

export type EventFilters<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
> = IsContractDeclarationMissing<
  Record<string, unknown>,
  IndexedEventInputs<TContractName, TEventName> extends never
    ? never
    : {
        [Key in IsContractDeclarationMissing<
          string,
          IndexedEventInputs<TContractName, TEventName>["name"]
        >]?: ExtractAbiEvent<ContractAbi<TContractName>, TEventName>["inputs"][number] & { name: Key };
      }
>;

export type UseScaffoldEventHistoryConfig<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
> = {
  contractName: TContractName;
  eventName: IsContractDeclarationMissing<string, TEventName>;
  fromBlock: bigint;
  filters?: EventFilters<TContractName, TEventName>;
  blockData?: TBlockData;
  transactionData?: TTransactionData;
  receiptData?: TReceiptData;
  watch?: boolean;
  enabled?: boolean;
};

export type UseScaffoldEventHistoryData<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false
> = Awaited<ReturnType<typeof useContractRead>>["data"] extends infer TData
  ? IsContractDeclarationMissing<
      unknown[],
      {
        log: Omit<Log<bigint, number, false, ExtractAbiEvent<ContractAbi<TContractName>, TEventName>, false, [ExtractAbiEvent<ContractAbi<TContractName>, TEventName>], TEventName>, "args"> & {
          args: ExtractAbiEvent<ContractAbi<TContractName>, TEventName>["inputs"];
        };
        args: ExtractAbiEvent<ContractAbi<TContractName>, TEventName>["inputs"];
        block: TBlockData extends true ? Block<bigint, true> : null;
        receipt: TReceiptData extends true ? GetTransactionReturnType : null;
        transaction: TTransactionData extends true ? GetTransactionReceiptReturnType : null;
      }[]
    >
  : undefined;

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;
