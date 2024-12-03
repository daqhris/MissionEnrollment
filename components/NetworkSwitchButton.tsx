'use client';

import React, { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import {
  NETWORK_CONFIG,
  getNetworkName,
  isCorrectNetwork,
  EAS_CONTRACT_ADDRESS_SEPOLIA,
  EAS_CONTRACT_ADDRESS_BASE
} from '../utils/constants';
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

      // Get contract code at network-specific EAS contract address
      const contractAddress = targetChainId === baseSepolia.id
        ? EAS_CONTRACT_ADDRESS_SEPOLIA
        : EAS_CONTRACT_ADDRESS_BASE;

      const code = await provider.request({
        method: 'eth_getCode',
        params: [contractAddress, 'latest']
      });

      return code !== '0x' && code !== '0x0';
    } catch (error) {
      console.error('Contract verification failed:', error);
      if (error.message?.includes('eth_getCode')) {
        throw new Error('Unable to verify EAS contract. Please check your connection and try again.');
      }
      return false;
    } finally {
      setIsVerifyingContract(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isContractVerified = await verifyContractConnection();
      if (!isContractVerified) {
        throw new Error(`Unable to verify EAS contract on ${getNetworkName(targetChainId)}. Please ensure you have the correct network configuration.`);
      }

      await switchChain({ chainId: targetChainId });
      onSuccess?.();
    } catch (error: any) {
      console.error('Network switch error:', error);
      const errorMessage = error.message?.includes('user rejected')
        ? 'Network switch was rejected. Please try again.'
        : error.message?.includes('verify EAS contract')
          ? error.message
          : `Failed to switch to ${getNetworkName(targetChainId)}. Please try again.`;

      setError(errorMessage);
      onError?.(new Error(errorMessage));
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
            onClick={handleSwitchNetwork}
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
