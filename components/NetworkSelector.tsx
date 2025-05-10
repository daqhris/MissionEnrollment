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

export default function NetworkSelector() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { 
    preferredNetwork, 
    setPreferredNetwork,
    isLoading 
  } = useUserNetworkPreference();

  const handleNetworkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferredNetwork(parseInt(event.target.value));
  };

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
        
        <RadioGroup
          value={preferredNetwork?.toString() || BASE_SEPOLIA_CHAIN_ID.toString()}
          onChange={handleNetworkChange}
        >
          <FormControlLabel 
            value={BASE_SEPOLIA_CHAIN_ID.toString()} 
            control={<Radio />} 
            label={
              <Box>
                <Typography variant="body1">{NETWORK_CONFIG[BASE_SEPOLIA_CHAIN_ID].name} (Testnet)</Typography>
                <Typography variant="body2" color="text.secondary">
                  Low cost option - Free attestations (gas fees only)
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
                <Typography variant="body1">{NETWORK_CONFIG[BASE_MAINNET_CHAIN_ID].name} (Mainnet)</Typography>
                <Typography variant="body2" color="text.secondary">
                  Standard option - Estimated cost: ~0.02 ETH (~€40) per attestation
                </Typography>
              </Box>
            }
            disabled={isLoading}
          />
        </RadioGroup>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Current network: {NETWORK_CONFIG[currentChainId]?.name || 'Unknown Network'}
          {currentChainId !== preferredNetwork && ' (Different from selected)'}
        </Typography>
      </CardContent>
    </Card>
  );
}
