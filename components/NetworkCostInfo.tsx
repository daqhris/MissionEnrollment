import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function NetworkCostInfo() {
  return (
    <Card sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          Network Cost Information
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Base Sepolia (Testnet)</Typography>
          <Typography variant="body2" paragraph>
            • Gas fees only: ~0.0001 ETH (~€0.20)<br />
            • Suitable for testing and development<br />
            • Attestations are not stored on the main Base network
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>Base Mainnet</Typography>
          <Typography variant="body2" paragraph>
            • Contract deployment: ~0.35 ETH (~€700)<br />
            • Schema creation: ~0.05 ETH (~€100)<br />
            • Per attestation cost: ~0.02 ETH (~€40)<br />
            • Attestations are permanently stored on the Base blockchain
          </Typography>
          
          <Typography variant="caption" color="text.secondary">
            * Cost estimates are approximate and may vary based on network conditions.
            Base ETH price estimated at €2,000 per ETH.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
