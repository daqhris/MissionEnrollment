import type { MutateOptions } from "@tanstack/react-query";
import type {
  Abi,
  AbiParameter,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames
} from "abitype";
import type { Simplify, MergeDeep } from "type-fest";
type MergeDeepRecord<T, U> = MergeDeep<T, U>;

import type {
  Address,
  Block,
  GetEventArgs,
  GetTransactionReceiptReturnType,
  GetTransactionReturnType,
  Log,
  TransactionReceipt,
  WriteContractParameters
} from "viem";

import type { ReadContractParameters, WatchContractEventParameters } from "wagmi/actions";

type UseContractReadConfig = ReadContractParameters;
type UseContractEventConfig = WatchContractEventParameters;
import deployedContractsData from "../../contracts/deployedContracts";
import externalContractsData from "../../contracts/externalContracts";
import scaffoldConfig from "../../scaffold.config";

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
  return result as MergeDeepRecord<AddExternalFlag<L>, AddExternalFlag<E>>;
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

export type AbiFunctionArguments<TAbi extends Abi, TFunctionName extends string> = AbiParametersToPrimitiveTypes<
  AbiFunctionInputs<TAbi, TFunctionName>
>;

export type AbiFunctionOutputs<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["outputs"];

export type AbiFunctionReturnType<TAbi extends Abi, TFunctionName extends string> = IsContractDeclarationMissing<
  unknown,
  AbiParametersToPrimitiveTypes<AbiFunctionOutputs<TAbi, TFunctionName>> extends readonly [unknown]
    ? AbiParametersToPrimitiveTypes<AbiFunctionOutputs<TAbi, TFunctionName>>[0]
    : AbiParametersToPrimitiveTypes<AbiFunctionOutputs<TAbi, TFunctionName>>
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
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, ReadAbiStateMutability>,
> = {
  contractName: TContractName;
  watch?: boolean;
} & IsContractDeclarationMissing<
  Partial<UseContractReadConfig>,
  {
    functionName: TFunctionName;
  } & UseScaffoldArgsParam<TContractName, TFunctionName> &
    Omit<UseContractReadConfig, "chainId" | "abi" | "address" | "functionName" | "args">
>;

export type ScaffoldWriteContractVariables<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, WriteAbiStateMutability>,
> = IsContractDeclarationMissing<
  Partial<WriteContractParameters>,
  {
    functionName: TFunctionName;
  } & UseScaffoldArgsParam<TContractName, TFunctionName> &
    Omit<WriteContractParameters, "chainId" | "abi" | "address" | "functionName" | "args">
>;



export type TransactorFuncOptions = {
  onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
  blockConfirmations?: number;
  onSuccess?: (txnResponse: WriteContractParameters) => void;
};

export type ScaffoldWriteContractOptions = MutateOptions<
  { hash: `0x${string}` },
  Error,
  WriteContractParameters,
  unknown
> &
  TransactorFuncOptions;

export type UseScaffoldEventConfig<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
> = {
  contractName: TContractName;
  eventName: TEventName;
} & IsContractDeclarationMissing<
  Omit<UseContractEventConfig, "listener" | "address" | "abi" | "eventName"> & {
    listener: (
      logs: Simplify<
        Omit<Log<bigint, number, boolean>, "args" | "eventName"> & {
          args: Record<string, unknown>;
          eventName: string;
        }
      >[],
    ) => void;
  },
  Omit<UseContractEventConfig, "listener" | "address" | "abi" | "eventName"> & {
    listener: (
      logs: Simplify<
        Omit<Log<bigint, number, false>, "args"> & {
          args: GetEventArgs<ContractAbi<TContractName>, TEventName>;
        }
      >[],
    ) => void;
  }
>;

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
        >]?: AbiParameterToPrimitiveType<Extract<IndexedEventInputs<TContractName, TEventName>, { name: Key }>>;
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
  TReceiptData extends boolean = false,
  TEvent extends ExtractAbiEvent<ContractAbi<TContractName>, TEventName> = ExtractAbiEvent<
    ContractAbi<TContractName>,
    TEventName
  >,
> =
  | IsContractDeclarationMissing<
      unknown[],
      {
        log: Log<bigint, number, false, TEvent, false, [TEvent], TEventName>;
        args: AbiParametersToPrimitiveTypes<TEvent["inputs"]> &
          GetEventArgs<
            ContractAbi<TContractName>,
            TEventName,
            {
              IndexedOnly: false;
            }
          >;
        block: TBlockData extends true ? Block<bigint, true> : null;
        receipt: TReceiptData extends true ? GetTransactionReturnType : null;
        transaction: TTransactionData extends true ? GetTransactionReceiptReturnType : null;
      }[]
    >
  | undefined;

export type AbiParameterTuple = Extract<AbiParameter, { type: "tuple" | `tuple[${string}]` }>;
