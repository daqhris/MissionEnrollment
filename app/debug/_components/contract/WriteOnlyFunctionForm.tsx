"use client";

import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import ContractInput from "./ContractInput";
import { InheritanceTooltip } from "./InheritanceTooltip";
import type { Abi, AbiFunction, AbiParameter } from "abitype";
import type { Address } from "viem";
import { useAccount, useTransaction, useWriteContract } from "wagmi";
import {
  TxReceipt,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "./";



type WriteOnlyFunctionFormProps = {
  abi: Abi;
  abiFunction: AbiFunction;
  onChange: () => void;
  contractAddress: Address;
  inheritedFrom?: string | undefined;
};

type FormState = Record<string, string | bigint>;

export const WriteOnlyFunctionForm = ({
  abi,
  abiFunction,
  onChange,
  contractAddress,
  inheritedFrom,
}: WriteOnlyFunctionFormProps): JSX.Element => {
  const [form, setForm] = useState<FormState>(() => getInitialFormState(abiFunction));
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { isConnected } = useAccount();

  const writeDisabled = !isConnected;

  const { writeContract, data: hash, isPending } = useWriteContract();

  const handleWrite = async (): Promise<void> => {
    if (writeContract) {
      try {
        const txConfig = {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: abiFunction.name,
          args: getParsedContractFunctionArgs(form),
          value: txValue ? BigInt(txValue) : undefined,
          maxFeePerBlobGas: undefined,
          blobs: undefined
        };
        await writeContract(txConfig);
        console.log('Transaction hash:', hash);
        onChange();
      } catch (e) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const { data: txData } = useTransaction({
    hash,
  });

  useEffect((): void => {
    if (txData) {
      console.log('Transaction data:', txData);
    }
  }, [txData]);

  // TODO use `useMemo` to optimize also update in ReadOnlyFunctionForm
  const transformedFunction = transformAbiFunction(abiFunction);
  const inputs = transformedFunction.inputs.map((input: AbiParameter, inputIndex: number) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={(updatedForm: SetStateAction<Record<string, unknown>>): void => {
          setForm((prevForm): FormState => {
            const newForm = typeof updatedForm === 'function' ? updatedForm(prevForm) : updatedForm;
            return { ...prevForm, ...newForm } as FormState;
          });
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });
  const zeroInputs = inputs.length === 0 && abiFunction.stateMutability !== "payable";

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">
          {abiFunction.name}
          {inheritedFrom && <InheritanceTooltip inheritedFrom={inheritedFrom} />}
        </p>
        {inputs}
        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="block text-xs font-extralight leading-none">wei</span>
            </div>
            <input
              type="text"
              value={txValue.toString()}
              onChange={(e): void => {
                setTxValue(e.target.value);
              }}
              placeholder="value (wei)"
              className="input input-bordered w-full"
            />
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          {!zeroInputs && (
            <div className="flex-grow basis-0">
              {txData && <TxReceipt txResult={txData} />}
            </div>
          )}
          <div
            className={`flex ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled ? "Wallet not connected or in the wrong network" : ""}`}
          >
            <button
              className="btn btn-secondary btn-sm"
              disabled={writeDisabled || isPending}
              onClick={handleWrite}
            >
              {isPending && <span className="loading loading-spinner loading-xs"></span>}
              Send 💸
            </button>
          </div>
        </div>
      </div>
      {zeroInputs && txData && (
        <div className="flex-grow basis-0">
          <TxReceipt txResult={txData} />
        </div>
      )}
    </div>
  );
};
