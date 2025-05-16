import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardContent, Typography, Box, Button, CircularProgress, Alert, Link } from '@mui/material';
import { BASE_MAINNET_CHAIN_ID, MISSION_ENROLLMENT_BASE_ETH_ADDRESS, BASE_SEPOLIA_CHAIN_ID } from '../utils/constants';
import { ExternalLinkIcon } from './ExternalLinkIcon';

interface MainnetSupportBannerProps {
  onSwitchToTestnet: () => Promise<boolean>;
}

export function MainnetSupportBanner({ onSwitchToTestnet }: MainnetSupportBannerProps) {
  const { address } = useAccount();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  
  const getDocumentUrl = (documentPath: string) => {
    const repoBaseUrl = 'https://github.com/daqhris/MissionEnrollment/blob/main/';
    
    const fileName = documentPath.split('/').pop();
    
    return `${repoBaseUrl}docs/${fileName}`;
  };
  
  const { data: deployerBalance, isLoading: isLoadingDeployerBalance } = useBalance({
    address: MISSION_ENROLLMENT_BASE_ETH_ADDRESS as `0x${string}`,
    chainId: BASE_MAINNET_CHAIN_ID,
  });

  const { data: userBalance, isLoading: isLoadingUserBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: BASE_MAINNET_CHAIN_ID,
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: () => {
        setIsSending(false);
        setTransactionSuccess(true);
      },
      onError: (error: Error) => {
        console.error('Transaction error:', error);
        setIsSending(false);
      }
    }
  });

  const handleSendETH = async () => {
    if (!address) return;
    
    setIsSending(true);
    try {
      await sendTransaction({
        to: MISSION_ENROLLMENT_BASE_ETH_ADDRESS as `0x${string}`,
        value: parseEther('0.01'), // Default to 0.01 ETH
        chainId: BASE_MAINNET_CHAIN_ID,
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
      setIsSending(false);
    }
  };

  const handleSwitchToTestnet = async () => {
    setIsSwitching(true);
    try {
      await onSwitchToTestnet();
    } catch (error) {
      console.error('Error switching to testnet:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Card sx={{
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '0.5rem',
      transition: 'box-shadow 0.2s',
      margin: { xs: '0.5rem', md: '1rem' },
      padding: { xs: '0.75rem', md: '1.5rem' },
      border: '1px solid rgba(59, 130, 246, 0.3)',
    }}>
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Base Mainnet Support Coming Soon
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B4513' }}>
            Attestations are currently only available on Base Sepolia testnet. Mainnet support is under development.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
          Help Enable Mainnet Attestations
        </Typography>
        
        <Typography paragraph sx={{ color: '#f0f9ff' }}>
          To deploy the attestation schemas and contracts on Base mainnet, we need ETH to cover gas costs. 
          Your support would help make this possible!
        </Typography>

        <Box sx={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.2)', 
          p: 2, 
          borderRadius: '0.5rem',
          mb: 2
        }}>
          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
            Current Wallet Balances
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
              Deployer Wallet:
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
              {isLoadingDeployerBalance ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                <Link href={`https://basescan.org/address/${MISSION_ENROLLMENT_BASE_ETH_ADDRESS}`} target="_blank" rel="noopener noreferrer" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                  {`${deployerBalance?.formatted || '0'} ${deployerBalance?.symbol || 'ETH'}`}<ExternalLinkIcon />
                </Link>
              )}
            </Typography>
          </Box>
          
          {address && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
                Your Wallet:
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                {isLoadingUserBalance ? (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                ) : (
                  <Link href={`https://basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    {`${userBalance?.formatted || '0'} ${userBalance?.symbol || 'ETH'}`}<ExternalLinkIcon />
                  </Link>
                )}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
            Support Mainnet Deployment
          </Typography>
          <Typography variant="body2" sx={{ color: '#f0f9ff', mb: 1 }}>
            Send ETH to the deployer wallet address to help fund mainnet deployment:
          </Typography>
          <Box sx={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.2)', 
            p: 2, 
            borderRadius: '0.5rem',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#ffffff'
          }}>
            {MISSION_ENROLLMENT_BASE_ETH_ADDRESS}
          </Box>
        </Box>
        
        <Box sx={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.2)', 
          p: 2, 
          borderRadius: '0.5rem',
          mb: 3
        }}>
          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
            Deployment Cost Estimates
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
              Contract Deployment:
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
              ~0.35 ETH
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
              Per Attestation:
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
              ~0.02 ETH
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#f0f9ff', mt: 1, fontSize: '0.75rem', fontStyle: 'italic' }}>
            *Estimates based on Base gas price of 0.1 Gwei. Actual costs may vary with market conditions.
            These figures are derived from previous deployment costs on Base Sepolia and projections for Base mainnet.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSendETH}
            disabled={isSending || !address}
            sx={{
              width: '100%',
              background: 'linear-gradient(45deg, #36B37E 30%, #2EB67D 90%)',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {isSending ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Sending donation...
              </>
            ) : transactionSuccess ? (
              'Thank you for your support!'
            ) : (
              'Send 0.01 ETH to Support Deployment'
            )}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSwitchToTestnet}
            disabled={isSwitching}
            sx={{ width: '100%' }}
          >
            {isSwitching ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Switching to Base Sepolia...
              </>
            ) : (
              'Switch to Base Sepolia Testnet'
            )}
          </Button>
        </Box>
        
        <Typography variant="body2" sx={{ color: '#f0f9ff', mt: 2, textAlign: 'center' }}>
          Continue with testnet attestations while mainnet support is in development.
          The migration roadmap includes deploying smart contracts, creating schemas, and updating network configurations.
          <Link href={getDocumentUrl('base-mainnet-migration-roadmap.md')} target="_blank" rel="noopener" sx={{ color: '#90caf9', display: 'block', mt: 1 }}>View Migration Roadmap →</Link>
          <Link href={getDocumentUrl('base-mainnet-deployment-guide.md')} target="_blank" rel="noopener" sx={{ color: '#90caf9', display: 'block', mt: 0.5 }}>View Deployment Guide →</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
