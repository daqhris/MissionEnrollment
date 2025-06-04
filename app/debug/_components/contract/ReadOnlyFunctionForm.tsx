"use client";

import React, { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import ContractInput from "./ContractInput";
import { InheritanceTooltip } from "./InheritanceTooltip";
import type { Abi, AbiFunction, AbiParameter } from "abitype";
import type { Hex } from "viem";
import { useContractRead } from "wagmi";
import {
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
} from "./";
import { displayTxResult } from "./utilsDisplay";
import type { DisplayContent } from "./utilsDisplay";
// import { useTargetNetwork } from "../../../hooks/scaffold-eth";
// import { getParsedError, notification } from "../../../utils/scaffold-eth";

type ReadOnlyFunctionFormProps = {
  contractAddress: Hex;
  functionName: string;
  functionArgs: readonly AbiParameter[];
  inheritedFrom?: string | undefined;
  abi: Abi;
};

type FormState = Record<string, unknown>;

export const ReadOnlyFunctionForm: React.FC<ReadOnlyFunctionFormProps> = ({
  contractAddress,
  functionName,
  functionArgs,
  inheritedFrom,
  abi,
}): JSX.Element => {
  const [form, setForm] = useState<FormState>(() => getInitialFormState({
    name: functionName,
    type: "function",
    inputs: functionArgs,
    outputs: [],
    stateMutability: "view"
  } as AbiFunction));
  const [result, setResult] = useState<unknown>();
  const targetNetwork = { id: 84532 }; // Base Sepolia

  const { isFetching, refetch, error } = useContractRead({
    address: contractAddress,
    abi,
    functionName,
    args: getParsedContractFunctionArgs(form),
    chainId: targetNetwork.id,
  });

  useEffect((): void => {
    if (error) {
      console.error('Contract read error:', error);
    }
  }, [error]);

  const inputElements = functionArgs.map((input, inputIndex): JSX.Element => {
    const key = getFunctionInputKey(functionName, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={(updatedFormValue: SetStateAction<FormState>): void => {
          setResult(undefined);
          setForm((prevForm: FormState): FormState => ({
            ...prevForm,
            ...(typeof updatedFormValue === 'function' ? updatedFormValue(prevForm) : updatedFormValue),
          }));
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });

  const handleRead = async (): Promise<void> => {
    const { data } = await refetch();
    setResult(data);
  };

  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
      <p className="font-medium my-0 break-words">
        {functionName}
        {inheritedFrom && <InheritanceTooltip inheritedFrom={inheritedFrom} />}
      </p>
      {inputElements}
      <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap">
        <div className="flex-grow w-full md:max-w-[80%]">
          {result !== null && result !== undefined && (
            <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
              <p className="font-bold m-0 mb-1">Result:</p>
              <pre className="whitespace-pre-wrap break-words">{displayTxResult(result as DisplayContent)}</pre>
            </div>
          )}
        </div>
        <button
          className="btn btn-secondary btn-sm self-end md:self-start"
          onClick={handleRead}
          disabled={isFetching}
        >
          {isFetching && <span className="loading loading-spinner loading-xs"></span>}
          Read 📡
        </button>
      </div>
    </div>
  );
};
