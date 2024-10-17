"use client";

import { useEffect } from "react";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { displayTxResult } from "./utilsDisplay";
import type { DisplayContent } from "./utilsDisplay";
import type { Abi, AbiFunction } from "abitype";
import type { Address } from "viem";
import { useContractRead } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type DisplayVariableProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  refreshDisplayVariables: boolean;
  inheritedFrom?: string | undefined;
  abi: Abi;
};

export const DisplayVariable = ({
  contractAddress,
  abiFunction,
  refreshDisplayVariables,
  abi,
  inheritedFrom,
}: DisplayVariableProps): JSX.Element => {
  // Removed unused variable

  const result = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: abiFunction.name,
  });

  const { data, isLoading: isFetching, refetch } = result;

  const error = result.error;

  const { showAnimation } = useAnimationConfig(data);

  useEffect((): void => {
    refetch();
  }, [refetch, refreshDisplayVariables]);

  useEffect((): void => {
    if (error) {
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    }
  }, [error]);

  return (
    <div className="space-y-1 pb-2">
      <div className="flex items-center">
        <h3 className="font-medium text-lg mb-0 break-all">{abiFunction.name}</h3>
        <button className="btn btn-ghost btn-xs" onClick={async (): Promise<void> => { await refetch(); }}>
          {isFetching ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
          )}
        </button>
        {inheritedFrom && <InheritanceTooltip inheritedFrom={inheritedFrom} />}
      </div>
      <div className="text-gray-500 font-medium flex flex-col items-start">
        <div>
          <div
            className={`break-all block transition bg-transparent ${
              showAnimation ? "bg-warning rounded-sm animate-pulse-fast" : ""
            }`}
          >
            {displayTxResult(data as DisplayContent | DisplayContent[])}
          </div>
        </div>
      </div>
    </div>
  );
};
