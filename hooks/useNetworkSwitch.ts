import { useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { switchNetwork } from 'wagmi/actions';
import { getRequiredNetwork, NETWORK_CONFIG } from '../utils/constants';
import { useUserNetworkPreference } from './useUserNetworkPreference';

export const useNetworkSwitch = (action: 'verification' | 'attestation') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkSwitched, setNetworkSwitched] = useState(false);

  const { chain } = useAccount();
  const config = useConfig();
  const chainId = chain?.id;
  
  const { preferredNetwork } = useUserNetworkPreference();
  
  const targetNetwork = getRequiredNetwork(action, action === 'attestation' ? preferredNetwork : undefined);

  const handleNetworkSwitch = async (specificChainId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const chainIdToUse = specificChainId || targetNetwork.id;
      const networkName = specificChainId 
        ? (NETWORK_CONFIG[specificChainId]?.name || 'Unknown Network')
        : targetNetwork.name;
      
      await switchNetwork(config, { chainId: chainIdToUse });
      const provider = window.ethereum;

      if (!provider) {
        throw new Error('No Web3 provider detected');
      }

      // Verify contract connection
      const targetChainId = `0x${chainIdToUse.toString(16)}`;
      const currentChainId = await provider.request({ method: 'eth_chainId' });

      if (currentChainId !== targetChainId) {
        throw new Error(`Failed to switch to ${networkName}`);
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
