import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { NetworkSwitchButton } from './NetworkSwitchButton';
import { Card, CardContent, Typography, Button, Box, Alert } from '@mui/material';

interface SchemaItem {
  name: string;
  value: any;
  type: string;
}

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
}

const BASE_SEPOLIA_CHAIN_ID = 84532;
const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
const SCHEMA_UID = '0x46a1e77e9f1d74c8c60c8d8bd8129947b3c5f4d3e6e9497ae2e4701dd8e2c401';

export default function EnrollmentAttestation({ verifiedName, poapVerified, onAttestationComplete }: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Constants for EAS
  const EAS_EXPLORER_URL = 'https://base-sepolia.easscan.org';
  const handleAttestationError = (err: Error) => {
    console.error('Attestation error:', {
      message: err.message,
      code: (err as any).code,
      chainId
    });

    let errorMessage = 'Failed to create attestation. Please try again.';

    if (err.message.includes('invalid signer')) {
      errorMessage = 'Invalid signer. Please ensure your wallet is properly connected.';
    } else if (err.message.includes('user rejected transaction')) {
      errorMessage = 'Transaction was rejected. Please try again and confirm the transaction in your wallet.';
    } else if (err.message.includes('Failed to extract attestation ID')) {
      errorMessage = 'Transaction succeeded but attestation ID could not be retrieved. Please check EAS Explorer for your attestation.';
    } else if (err.message.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for transaction. Please ensure you have enough Base Sepolia ETH.';
    }

    setError(errorMessage);
    setLoading(false);
  };

  const createAttestation = async () => {
    if (!address || !walletClient) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log('Starting attestation process...');

      // Ensure we're on Base Sepolia first
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        setError('Please switch to Base Sepolia network first using the yellow button above.');
        setLoading(false);
        return;
      }

      // Get provider and signer after ensuring correct chain
      console.log('Getting provider and signer...');
      const provider = new BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      if (!signer) {
        throw new Error('Failed to get signer from wallet.');
      }

      // Initialize EAS with proper chain verification
      console.log('Initializing EAS...');
      const eas = new EAS(EAS_CONTRACT_ADDRESS);

      // Connect signer to EAS
      console.log('Connecting signer to EAS...');
      await eas.connect(signer);
      console.log('EAS SDK initialized successfully');

      // Verify chain again after signer initialization
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
        throw new Error('Wrong network detected after initialization. Please ensure you are on Base Sepolia.');
      }

      // Create attestation data
      console.log('Creating attestation data...');
      const schemaEncoder = new SchemaEncoder("address userAddress,string verifiedName,bool poapVerified,uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "verifiedName", value: verifiedName, type: "string" },
        { name: "poapVerified", value: poapVerified, type: "bool" },
        { name: "timestamp", value: BigInt(Math.floor(Date.now() / 1000)), type: "uint256" }
      ]);

      // Submit attestation
      console.log('Submitting attestation with data:', {
        address,
        verifiedName,
        poapVerified,
        timestamp: Math.floor(Date.now() / 1000)
      });

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData
        }
      });

      console.log('Transaction submitted:', tx.hash);
      setTransactionHash(tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // Find the Attested event in the logs
      const attestEvent = receipt.logs.find(log =>
        log.address.toLowerCase() === EAS_CONTRACT_ADDRESS.toLowerCase() &&
        log.topics[0] === ethers.id("Attested(address,address,bytes32,bytes32)")
      );

      if (!attestEvent || !attestEvent.topics[2]) {
        throw new Error('Failed to extract attestation ID from transaction logs');
      }

      const newAttestationId = attestEvent.topics[2];
      setAttestationId(newAttestationId);
      onAttestationComplete(newAttestationId);
      setSuccess(true);
    } catch (err: any) {
      handleAttestationError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Enrollment Attestation
        </Typography>

        {/* Show attestation details before creation */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Attestation Details:
          </Typography>
          <Typography variant="body2">
            • Verified Name: {verifiedName}
          </Typography>
          <Typography variant="body2">
            • POAP Verification: {poapVerified ? 'Verified' : 'Not Verified'}
          </Typography>
          <Typography variant="body2">
            • Wallet Address: {address}
          </Typography>
        </Box>

        {/* Network switch button */}
        <NetworkSwitchButton />

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success message with links */}
        {success && attestationId && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            Attestation created successfully!
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                • View on EAS Explorer:{' '}
                <a href={`${EAS_EXPLORER_URL}/attestation/view/${attestationId}`} target="_blank" rel="noopener noreferrer">
                  View Attestation
                </a>
              </Typography>
              {transactionHash && (
                <Typography variant="body2">
                  • View Transaction:{' '}
                  <a href={`https://base-sepolia.blockscout.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                    View Transaction
                  </a>
                </Typography>
              )}
            </Box>
          </Alert>
        )}

        {/* Create attestation button */}
        <Button
          variant="contained"
          onClick={createAttestation}
          disabled={loading || !address || chain?.id !== 84532}
          sx={{ mt: 2 }}
        >
          {loading ? 'Creating Attestation...' : 'Create Attestation'}
        </Button>
      </CardContent>
    </Card>
  );
}
