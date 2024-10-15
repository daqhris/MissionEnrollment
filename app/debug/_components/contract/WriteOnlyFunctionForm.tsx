import { useState, useEffect } from "react";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import ContractInput from "./ContractInput";
import type { Abi, AbiFunction } from "abitype";
import type { Address } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IntegerInput } from "~~/components/scaffold-eth";

export const WriteOnlyFunctionForm = ({
  abiFunction,
  contractAddress,
  onChange,
  abi,
}: {
  abiFunction: AbiFunction;
  contractAddress: Address;
  onChange: (result: `0x${string}`) => void;
  abi: Abi;
}): JSX.Element => {
  const { address } = useAccount();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [txValue, setTxValue] = useState<string>("");

  const { writeContract, data: hash } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleWrite = async (): Promise<void> => {
    if (writeContract) {
      try {
        const args = Object.values(form);
        const result = await writeContract({
          address: contractAddress,
          abi,
          functionName: abiFunction.name,
          args,
          value: txValue ? BigInt(txValue) : undefined,
        });
        if (typeof result === 'string') {
          onChange(result);
        }
      } catch (e) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      notification.success("Transaction completed successfully!");
    }
  }, [isSuccess, hash]);

  const inputs = abiFunction.inputs.map((input, inputIndex) => {
    const key = `${abiFunction.name}_${input.name}_${inputIndex}`;
    return (
      <ContractInput
        key={key}
        setForm={setForm}
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
        </p>
        {inputs}
        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="text-xs font-extralight leading-none">wei</span>
            </div>
            <IntegerInput
              value={txValue}
              onChange={(updatedTxValue: string | bigint): void => {
                setTxValue(updatedTxValue.toString());
              }}
              placeholder="value (wei)"
            />
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <div
            className={`flex ${
              !address &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${!address ? "Wallet not connected" : ""}`}
          >
            <button
              className="btn btn-secondary btn-sm"
              disabled={!address || !writeContract}
              onClick={handleWrite}
            >
              {!writeContract && <span className="loading loading-spinner loading-xs"></span>}
              Send 💸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
