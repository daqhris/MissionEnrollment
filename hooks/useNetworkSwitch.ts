import { useState } from 'react';
import { getAccount, getPublicClient, switchChain } from 'wagmi/actions';
import { type Chain } from 'viem';
import { config, getRequiredNetwork } from '../utils/wagmi';
import type { EthereumProvider } from '../types/ethereum';

export const useNetworkSwitch = (action: 'verification' | 'attestation') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkSwitched, setNetworkSwitched] = useState(false);
  const [attestationField, setAttestationField] = useState<string>('');

  const publicClient = getPublicClient(config);
  const account = getAccount(config);
  const targetNetwork = getRequiredNetwork(action);

  const handleNetworkSwitch = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!account.address) {
        throw new Error('No wallet connected');
      }

      await switchChain(config, {
        chainId: targetNetwork.id
      });

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
      // Clear attestation field before switch, it will be filled after in the component
      setAttestationField('');
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to switch network';
      setError(errorMessage);
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
    currentChainId: publicClient?.chain?.id,
    attestationField,
    setAttestationField
  };
};
