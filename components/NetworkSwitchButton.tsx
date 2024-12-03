'use client';

import React, { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { NETWORK_CONFIG, getNetworkName, isCorrectNetwork, MISSION_ENROLLMENT_BASE_ETH_ADDRESS } from '../utils/constants';
import { base, baseSepolia } from 'viem/chains';

interface NetworkSwitchButtonProps {
  className?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  targetChainId: number;
  action: 'verification' | 'attestation';
}

const NetworkSwitchButton: React.FC<NetworkSwitchButtonProps> = ({
  className = '',
  onError,
  onSuccess,
  targetChainId,
  action
}) => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingContract, setIsVerifyingContract] = useState(false);

  const verifyContractConnection = async (): Promise<boolean> => {
    try {
      setIsVerifyingContract(true);
      const provider = window.ethereum;
      if (!provider) {
        throw new Error('No Web3 provider detected');
      }

      // Get contract code at address to verify it exists
      const code = await provider.request({
        method: 'eth_getCode',
        params: [MISSION_ENROLLMENT_BASE_ETH_ADDRESS, 'latest']
      });

      return code !== '0x' && code !== '0x0';
    } catch (error) {
      console.error('Contract verification failed:', error);
      return false;
    } finally {
      setIsVerifyingContract(false);
    }
  };

  const handleNetworkSwitch = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      // Check if wallet is connected before attempting switch
      if (!window.ethereum) {
        throw new Error('No wallet detected. Please install a Web3 wallet.');
      }

      await switchChain({ chainId: targetChainId });

      // Add delay to allow chain switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the switch was successful
      const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(currentChain, 16) !== targetChainId) {
        throw new Error('Network switch failed. Please try again.');
      }

      // Verify contract connection if switching for attestation
      if (action === 'attestation') {
        const isContractValid = await verifyContractConnection();
        if (!isContractValid) {
          throw new Error('Unable to verify contract on Base Sepolia. Please try again.');
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      const errorMessage = error.code === 4902
        ? `Please add ${getNetworkName(targetChainId)} to your wallet`
        : error.message || 'Failed to switch network. Please try again.';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={className} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      {isVerifyingContract ? (
        <Typography variant="body2" color="info.main">
          Verifying contract connection...
        </Typography>
      ) : (
        <>
          <Button
            onClick={handleNetworkSwitch}
            variant="contained"
            color={targetChainId === base.id ? "primary" : "warning"}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> :
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
          >
            {isLoading
              ? 'Switching Network...'
              : `Switch to ${getNetworkName(targetChainId)}`}
          </Button>
          {error && (
            <Typography variant="caption" color="error" sx={{ textAlign: 'center', maxWidth: '80%', mt: 1 }}>
              {error}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {targetChainId === base.id
              ? '⚠️ Base mainnet required for identity verification'
              : '⚠️ Base Sepolia required for creating attestation'}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default NetworkSwitchButton;
