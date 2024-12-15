import { useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { switchNetwork } from 'wagmi/actions';
import { getRequiredNetwork } from '../utils/constants';

export const useNetworkSwitch = (action: 'verification' | 'attestation') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkSwitched, setNetworkSwitched] = useState(false);

  const { chain } = useAccount();
  const config = useConfig();
  const chainId = chain?.id;

  const targetNetwork = getRequiredNetwork(action);

  const handleNetworkSwitch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork(config, { chainId: targetNetwork.id });
      const provider = window.ethereum;

      if (!provider) {
        throw new Error('No Web3 provider detected');
      }

      // Verify contract connection
      const targetChainId = `0x${targetNetwork.id.toString(16)}`;
      const currentChainId = await provider.request({ method: 'eth_chainId' });

      if (currentChainId !== targetChainId) {
        throw new Error(`Failed to switch to ${targetNetwork.name}`);
      }

      setNetworkSwitched(true);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError(error?.message || 'Failed to switch network');
      setIsLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    error,
    networkSwitched,
    handleNetworkSwitch,
    targetNetwork,
    chainId
  };
};
