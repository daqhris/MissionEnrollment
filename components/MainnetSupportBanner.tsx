import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { BASE_MAINNET_CHAIN_ID, MISSION_ENROLLMENT_BASE_ETH_ADDRESS } from '../utils/constants';

interface MainnetSupportBannerProps {
  onSwitchToTestnet: () => Promise<boolean>;
}

export function MainnetSupportBanner({ onSwitchToTestnet }: MainnetSupportBannerProps) {
  const { address } = useAccount();
  const [isSwitching, setIsSwitching] = useState(false);
  
  const { data: deployerBalance, isLoading: isLoadingDeployerBalance } = useBalance({
    address: MISSION_ENROLLMENT_BASE_ETH_ADDRESS as `0x${string}`,
    chainId: BASE_MAINNET_CHAIN_ID,
  });

  const { data: userBalance, isLoading: isLoadingUserBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: BASE_MAINNET_CHAIN_ID,
  });

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
          <Typography variant="body2">
            Attestations are currently only available on Base Sepolia testnet. Mainnet support is under development.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ color: '#1E40AF', fontWeight: 600 }}>
          Help Enable Mainnet Attestations
        </Typography>
        
        <Typography paragraph sx={{ color: '#1F2937' }}>
          To deploy the attestation schemas and contracts on Base mainnet, we need ETH to cover gas costs. 
          Your support would help make this possible!
        </Typography>

        <Box sx={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.05)', 
          p: 2, 
          borderRadius: '0.5rem',
          mb: 2
        }}>
          <Typography variant="subtitle2" sx={{ color: '#1F2937', fontWeight: 600, mb: 1 }}>
            Current Wallet Balances
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#1F2937' }}>
              Deployer Wallet:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 600 }}>
              {isLoadingDeployerBalance ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                `${deployerBalance?.formatted || '0'} ${deployerBalance?.symbol || 'ETH'}`
              )}
            </Typography>
          </Box>
          
          {address && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#1F2937' }}>
                Your Wallet:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 600 }}>
                {isLoadingUserBalance ? (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                ) : (
                  `${userBalance?.formatted || '0'} ${userBalance?.symbol || 'ETH'}`
                )}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#1F2937', fontWeight: 600, mb: 1 }}>
            Support Mainnet Deployment
          </Typography>
          <Typography variant="body2" sx={{ color: '#1F2937', mb: 1 }}>
            Send ETH to the deployer wallet address to help fund mainnet deployment:
          </Typography>
          <Box sx={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.05)', 
            p: 2, 
            borderRadius: '0.5rem',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>
            {MISSION_ENROLLMENT_BASE_ETH_ADDRESS}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
        
        <Typography variant="body2" sx={{ color: '#1F2937', mt: 2, textAlign: 'center' }}>
          Continue with testnet attestations while mainnet support is in development.
        </Typography>
      </CardContent>
    </Card>
  );
}
