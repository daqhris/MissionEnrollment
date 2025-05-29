import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  FormControlLabel,
  Radio, 
  RadioGroup,
  Tooltip,
  Box
} from '@mui/material';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { 
  NETWORK_CONFIG, 
  BASE_SEPOLIA_CHAIN_ID, 
  BASE_MAINNET_CHAIN_ID 
} from '../utils/constants';
import { useUserNetworkPreference } from '../hooks/useUserNetworkPreference';
import { useNetworkSwitch } from '../hooks/useNetworkSwitch';
import { MainnetSupportBanner } from './MainnetSupportBanner';

export default function NetworkSelector() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { 
    preferredNetwork, 
    setPreferredNetwork,
    isLoading 
  } = useUserNetworkPreference();
  
  const {
    isLoading: isSwitching,
    error: switchError,
    handleNetworkSwitch
  } = useNetworkSwitch('attestation');

  const handleNetworkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNetwork = parseInt(event.target.value);
    setPreferredNetwork(newNetwork);
  };
  
  const triggerNetworkSwitch = async () => {
    await handleNetworkSwitch();
  };
  
  useEffect(() => {
    const networkMismatch = currentChainId !== preferredNetwork;
    
  }, [currentChainId, preferredNetwork]);

  if (!address) return null;

  return (
    <Card sx={{ mb: 3, backgroundColor: 'rgba(66, 153, 225, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Network Selection
          <Tooltip title="Choose which network to use for attestations. Base Sepolia is a testnet with minimal costs, while Base mainnet involves real transaction fees.">
            <Box component="span" sx={{ ml: 1, cursor: 'help' }}>
              <InformationCircleIcon className="h-5 w-5" />
            </Box>
          </Tooltip>
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#f0f9ff', mb: 2 }}>
          Select your preferred network for creating your mission enrollment attestation. Each network offers different features and costs.
        </Typography>
        
        <RadioGroup
          value={preferredNetwork?.toString() || BASE_SEPOLIA_CHAIN_ID.toString()}
          onChange={handleNetworkChange}
        >
          <FormControlLabel 
            value={BASE_SEPOLIA_CHAIN_ID.toString()} 
            control={<Radio />} 
            label={
              <Box>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>{NETWORK_CONFIG[BASE_SEPOLIA_CHAIN_ID].name} (Testnet)</Typography>
                <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
                  ✅ Ready for attestations - Low cost option with minimal gas fees
                </Typography>
              </Box>
            }
            disabled={isLoading}
          />
          <FormControlLabel 
            value={BASE_MAINNET_CHAIN_ID.toString()} 
            control={<Radio />} 
            label={
              <Box>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>{NETWORK_CONFIG[BASE_MAINNET_CHAIN_ID].name} (Mainnet)</Typography>
                <Typography variant="body2" sx={{ color: '#f0f9ff' }}>
                  🚧 Support needed - Help fund mainnet deployment (estimated ~0.02 ETH per attestation)
                </Typography>
              </Box>
            }
            disabled={isLoading}
          />
        </RadioGroup>
        
        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#f0f9ff' }}>
          Current network: {NETWORK_CONFIG[currentChainId]?.name || 'Unknown Network'}
          {currentChainId !== preferredNetwork && ' (Different from selected)'}
        </Typography>
        
        {/* Display MainnetSupportBanner when Base mainnet is selected */}
        {preferredNetwork === BASE_MAINNET_CHAIN_ID && (
          <Box mt={2}>
            <MainnetSupportBanner 
              onSwitchToTestnet={() => handleNetworkSwitch(BASE_SEPOLIA_CHAIN_ID)}
            />
          </Box>
        )}
        
        {currentChainId !== preferredNetwork && (
          <Button
            variant="outlined"
            size="small"
            onClick={triggerNetworkSwitch}
            disabled={isSwitching}
            sx={{ mt: 2 }}
          >
            {isSwitching ? 'Switching...' : 'Switch to Selected Network'}
          </Button>
        )}
        
        {switchError && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>{switchError}</Typography>}
      </CardContent>
    </Card>
  );
}
