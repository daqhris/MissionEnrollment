import { useState } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { EAS, SchemaEncoder, type AttestationRequest } from "@ethereum-attestation-service/eas-sdk";
import { Contract } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Interface } from '@ethersproject/abi';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Card, CardContent, Typography, Button, CircularProgress, Box, Link } from '@mui/material';
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
  const [previewData, setPreviewData] = useState<{
    userAddress: string;
    verifiedName: string;
    poapVerified: boolean;
    timestamp: number;
  } | null>(null);

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
    if (!address || !previewData) {
      setError("Please connect your wallet and preview the attestation first");
      return;
    }

    if (!publicClient) {
      setError("Web3 provider not available");
      return;
    }

    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      setError("Please switch to Base Sepolia network");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTransactionHash(null);

      // Initialize provider and signer
      await publicClient.transport.request({ method: 'eth_requestAccounts' });
      const provider = new Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();

      // Initialize EAS with the correct contract address
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      // @ts-ignore - Types mismatch between ethers v5 and EAS SDK
      await eas.connect(signer);

      // Create Schema Encoder instance and encode data
      const schemaEncoder = new SchemaEncoder("address userAddress,string verifiedName,bool poapVerified,uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: previewData.userAddress, type: "address" },
        { name: "verifiedName", value: previewData.verifiedName, type: "string" },
        { name: "poapVerified", value: previewData.poapVerified, type: "bool" },
        { name: "timestamp", value: previewData.timestamp, type: "uint256" }
      ]);

      // Prepare the attestation request
      const attestationRequest: AttestationRequest = {
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      };

      // Create the attestation
      console.log('Creating attestation with request:', attestationRequest);
      const tx = await eas.attest(attestationRequest);
      console.log('Transaction sent:', tx);

      // Wait for transaction confirmation and cast to correct type
      const receipt = await tx.wait() as unknown as TransactionReceipt;
      console.log('Transaction confirmed:', receipt);

      // Get the AttestationCreated event
      const iface = new Interface([
        "event AttestationCreated(address indexed creator, bytes32 indexed uid)"
      ]);

      if (receipt.logs) {
        const attestEvent = receipt.logs
          .map((log: { topics: string[], data: string }) => {
            try {
              return iface.parseLog(log);
            } catch (e) {
              return null;
            }
          })
          .find((event: { name: string; args: any } | null) => event && event.name === 'AttestationCreated');

        if (attestEvent) {
          console.log('Attestation created:', {
            creator: attestEvent.args.creator,
            uid: attestEvent.args.uid
          });
        }
      }

      if (receipt.transactionHash) {
        setTransactionHash(receipt.transactionHash);
      }
      setLoading(false);

    } catch (err: any) {
      console.error('Error creating attestation:', err);
      handleAttestationError(err);
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Enrollment Attestation
        </Typography>

        {/* Preview Section */}
        {previewData && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Attestation Preview</Typography>
            <Typography variant="body2">User Address: {previewData.userAddress}</Typography>
            <Typography variant="body2">Verified Name: {previewData.verifiedName}</Typography>
            <Typography variant="body2">POAP Verified: {previewData.poapVerified ? 'Yes' : 'No'}</Typography>
            <Typography variant="body2">Timestamp: {new Date(previewData.timestamp * 1000).toLocaleString()}</Typography>
          </Box>
        )}

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

        {/* Preview Button */}
        <Button
          variant="outlined"
          onClick={() => setPreviewData({
            userAddress: address || '',
            verifiedName,
            poapVerified,
            timestamp: Math.floor(Date.now() / 1000)
          })}
          disabled={!address}
          sx={{ mr: 2 }}
        >
          Preview Attestation
        </Button>

        {/* Create Attestation Button */}
        <Button
          variant="contained"
          onClick={createAttestation}
          disabled={loading || chainId !== BASE_SEPOLIA_CHAIN_ID || !previewData}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Attestation'}
        </Button>

        {/* Transaction Hash Display */}
        {transactionHash && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Transaction Hash: <Link href={`https://sepolia.basescan.org/tx/${transactionHash}`} target="_blank" rel="noopener">
                {transactionHash}
              </Link>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
