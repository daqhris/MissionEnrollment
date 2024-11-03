import { useState } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { EAS, SchemaEncoder, type AttestationRequest } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import NetworkSwitchButton from './NetworkSwitchButton';
import { BASE_SEPOLIA_CHAIN_ID, EAS_CONTRACT_ADDRESS, SCHEMA_UID } from '../utils/constants';

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationUID: string) => void;
}

type AttestationError = {
  message: string;
  code?: number;
};

export default function EnrollmentAttestation({ verifiedName, poapVerified, onAttestationComplete }: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleAttestationError = (err: Error) => {
    console.error('Attestation error:', {
      message: err.message,
      code: (err as any).code,
      chainId
    });

    let errorMessage = 'Failed to create attestation. Please try again.';

    if (err.message.includes('invalid signer')) {
      errorMessage = 'Invalid signer. Please check your wallet connection.';
    } else if (err.message.includes('user rejected')) {
      errorMessage = 'Transaction was rejected. Please try again.';
    }

    setError(errorMessage);
    setLoading(false);
  };

  const createAttestation = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (!publicClient) {
        throw new Error('Web3 provider not available');
      }

      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        throw new Error('Please switch to Base Sepolia network');
      }

      // Initialize EAS SDK
      const eas = new EAS(EAS_CONTRACT_ADDRESS);

      // Create Schema Encoder instance
      const schemaEncoder = new SchemaEncoder("string name, bool poapVerified");
      const encodedData = schemaEncoder.encodeData([
        { name: "name", value: verifiedName, type: "string" },
        { name: "poapVerified", value: poapVerified, type: "bool" }
      ]);

      // Prepare the attestation request
      const attestationRequest = {
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      };

      // Submit the attestation
      const attestationResponse = await eas.attest(attestationRequest);

      if (!attestationResponse || !attestationResponse.data) {
        throw new Error('Failed to submit attestation');
      }

      // Get transaction hash and wait for confirmation
      const txHash = typeof attestationResponse.data === 'string'
        ? attestationResponse.data
        : attestationResponse.data.toString();
      setTransactionHash(txHash);

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      console.log('Transaction receipt:', receipt);

      if (!receipt || !receipt.logs || receipt.logs.length === 0) {
        throw new Error('No logs found in transaction receipt');
      }

      // Create an interface to parse the logs
      const iface = new ethers.Interface([
        'event Attested(bytes32 indexed attestationUID, address indexed recipient, address indexed attester, bytes32 referenceUID, bytes32 schemaUID, uint64 expirationTime, bool revocable)'
      ]);

      // Parse logs to find the attestation event
      const attestEvent = receipt.logs
        .map(log => {
          try {
            return iface.parseLog({
              topics: log.topics as string[],
              data: log.data
            });
          } catch (e) {
            return null;
          }
        })
        .find(event => event && event.name === 'Attested');

      if (!attestEvent) {
        throw new Error('Attestation event not found in transaction receipt');
      }

      // Get the attestation UID from the event args
      const attestationUID = attestEvent.args[0];
      onAttestationComplete(attestationUID);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAttestationError(error as Error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Enrollment Attestation
        </Typography>
        {chainId !== BASE_SEPOLIA_CHAIN_ID && (
          <Box sx={{ mb: 2 }}>
            <NetworkSwitchButton targetChainId={BASE_SEPOLIA_CHAIN_ID} />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={createAttestation}
          disabled={loading || chainId !== BASE_SEPOLIA_CHAIN_ID}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Attestation'}
        </Button>
      </CardContent>
    </Card>
  );
}
