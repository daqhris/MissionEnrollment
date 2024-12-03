import { useReadContract, type UseReadContractParameters } from 'wagmi';
import type { Address, Abi } from 'viem';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useTargetNetwork } from './useTargetNetwork';
import type { ContractName, UseScaffoldReadConfig } from '../../utils/scaffold-eth/contract';

type CustomUseReadContractParameters = Omit<UseReadContractParameters, 'address'> & {
  address?: Address;
  enabled?: boolean;
};

export const useScaffoldReadContract = <
  TContractName extends ContractName,
  TAbi extends Abi,
  TFunctionName extends string
>({
  contractName,
  functionName,
  args,
  ...readContractConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  const contractAddress = deployedContractData?.address;
  const contractAbi = deployedContractData?.abi as TAbi | undefined;

  return useReadContract({
    chainId: targetNetwork.id,
    functionName,
    address: contractAddress,
    abi: contractAbi,
    args,
    enabled: contractAddress !== undefined && contractAbi !== undefined && (!Array.isArray(args) || !args.some(arg => arg === undefined)),
    ...readContractConfig,
  } as CustomUseReadContractParameters);
};
