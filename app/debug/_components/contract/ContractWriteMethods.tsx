import type { Abi, AbiFunction } from "abitype";
import { WriteOnlyFunctionForm } from "./";
import type { Contract, ContractName, GenericContract, InheritedFunctions } from "../../../utils/scaffold-eth/contract";

interface FunctionDisplay {
  fn: AbiFunction;
  inheritedFrom?: string | undefined;
}

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
}): JSX.Element | null => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay: FunctionDisplay[] = (
    (deployedContractData.abi as Abi).filter((part): part is AbiFunction => part.type === "function")
  )
    .filter((fn: AbiFunction): boolean => {
      const isWriteableFunction = fn.stateMutability !== "view" && fn.stateMutability !== "pure";
      return isWriteableFunction;
    })
    .map((fn: AbiFunction): FunctionDisplay => {
      return {
        fn,
        inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
      };
    })
    .sort((a: FunctionDisplay, b: FunctionDisplay): number =>
      (b.inheritedFrom && a.inheritedFrom) ? b.inheritedFrom.localeCompare(a.inheritedFrom) : b.inheritedFrom ? -1 : a.inheritedFrom ? 1 : 0
    );

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn, inheritedFrom }: FunctionDisplay, idx: number) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}`}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
