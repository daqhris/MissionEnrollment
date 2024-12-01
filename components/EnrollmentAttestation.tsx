import { useState } from 'react';
import { useAccount, useChainId, useWalletClient, usePublicClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Card, CardContent, Typography, Button, CircularProgress, Box, Link } from '@mui/material';
import NetworkSwitchButton from './NetworkSwitchButton';
import { BASE_SEPOLIA_CHAIN_ID, EAS_CONTRACT_ADDRESS, SCHEMA_UID } from '../utils/constants';
import {
  BrowserProvider,
  Contract,
  Interface,
  type Log,
  type TransactionResponse,
  type TransactionReceipt
} from 'ethers';

// Initialize ethers Interface for EAS events
const easInterface = new Interface([
  'event Attested(address indexed recipient, address indexed attester, bytes32 indexed uid, bytes32 schema)',
]);

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationUID: string) => void;
}

type AttestationError = {
  message: string;
  code?: number;
};

interface SchemaData {
  userAddress: string;
  verifiedName: string;
  poapVerified: boolean;
  timestamp: number;
}

interface AttestationData {
  recipient: string;
  expirationTime: bigint;
  revocable: boolean;
  refUID: string;
  data: string;
}

interface AttestationTransaction extends TransactionResponse {
  wait(): Promise<TransactionReceipt>;
}

export default function EnrollmentAttestation({ verifiedName, poapVerified, onAttestationComplete }: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
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

  const handleNetworkSwitch = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Handle the case where the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        handleAttestationError(new Error('Please add Base Sepolia network to your wallet'));
      } else {
        handleAttestationError(switchError);
      }
    }
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

      // Initialize EAS with the correct contract address
      const eas = new EAS(EAS_CONTRACT_ADDRESS);

      // Ensure wallet is connected
      if (!walletClient) throw new Error("Wallet client not available");
      if (!address) throw new Error("Wallet not connected");

      // Create an Ethers v6 provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Connect the signer to EAS
      await eas.connect(signer);

      // Ensure we're on the correct network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
        await handleNetworkSwitch();
        return; // Exit and let the user try again after network switch
      }

      // Create Schema Encoder instance and encode data
      const schemaEncoder = new SchemaEncoder("address userAddress,string verifiedName,bool poapVerified,uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: previewData.userAddress, type: "address" },
        { name: "verifiedName", value: previewData.verifiedName, type: "string" },
        { name: "poapVerified", value: previewData.poapVerified, type: "bool" },
        { name: "timestamp", value: previewData.timestamp, type: "uint256" }
      ]);

      // Prepare the attestation request
      const attestationData: AttestationData = {
        recipient: address,
        expirationTime: BigInt(0),
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData
      };

      console.log('Creating attestation with data:', attestationData);

      // Submit the attestation
      console.log('Submitting attestation with schema:', SCHEMA_UID);
      console.log('Attestation data:', attestationData);

      // Cast the transaction to unknown first, then to AttestationTransaction
      const rawTransaction = await eas.attest({
        schema: SCHEMA_UID,
        data: attestationData
      });

      const transaction = rawTransaction as unknown as AttestationTransaction;
      console.log('Transaction submitted:', transaction);

      // Wait for the transaction to be mined
      console.log('Waiting for transaction confirmation...');
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);

      if (!receipt || !receipt.logs) {
        console.error('Invalid transaction receipt:', receipt);
        throw new Error('Invalid transaction receipt');
      }

      // Set transaction hash
      setTransactionHash(receipt.hash);

      // Get the transaction logs
      const logs = receipt.logs;
      console.log('Processing transaction logs:', logs);

      // Find and parse the attestation event log
      const attestationLog = logs.find((log: Log) => {
        if (!log?.topics?.[0]) {
          console.error('Invalid log format:', log);
          return false;
        }
        try {
          const event = easInterface.getEvent('Attested');
          if (!event) {
            console.error('Failed to get Attested event from interface');
            return false;
          }
          return log.topics[0].toLowerCase() === event.topicHash.toLowerCase();
        } catch (e) {
          console.error('Error processing log:', e);
          return false;
        }
      });

      if (!attestationLog) {
        console.error('No attestation event found in logs:', logs);
        throw new Error('Unable to find attestation event in transaction logs');
      }

      try {
        // Parse the event using ethers Interface
        const parsedLog = easInterface.parseLog({
          topics: attestationLog.topics as string[],
          data: attestationLog.data
        });

        if (!parsedLog || !parsedLog.args) {
          throw new Error('Failed to parse attestation event');
        }

        const uid = parsedLog.args.uid;
        if (!uid) {
          throw new Error('No UID found in parsed event');
        }
        console.log('Successfully parsed attestation event. UID:', uid);

        // Verify the attestation exists
        const attestation = await eas.getAttestation(uid);
        if (!attestation) {
          throw new Error('Attestation verification failed');
        }
        console.log('Attestation verified:', attestation);

        onAttestationComplete(uid);
        setLoading(false);
        return uid;
      } catch (error) {
        console.error('Error parsing attestation event:', error);
        throw new Error('Failed to parse attestation event. Please check the transaction logs.');
      }
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
          Enrollment Attestation
        </Typography>

        {!address && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Please connect your wallet to continue
            </Typography>
            <ConnectButton />
          </Box>
        )}

        {/* Preview Section */}
        {previewData && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Attestation Preview</Typography>
            <Typography variant="h6" gutterBottom>Identity Check: OK</Typography>
            <Typography variant="body2">User Address: {previewData?.userAddress}</Typography>
            <Typography variant="body2">Public Identity: {previewData?.verifiedName}</Typography>
            <Typography variant="body2">Proof Verification: Basename Protocol</Typography>

            <Typography variant="h6" gutterBottom>Event Attendance: OK</Typography>
            <Typography variant="body2">In-person Event: ETHGlobal Brussels 2024</Typography>
            <Typography variant="body2">Event Type: International Hackathon</Typography>
            <Typography variant="body2">Assigned Role: Hacker</Typography>

            <Typography variant="h6" gutterBottom>Early Registration: OK</Typography>
            <Typography variant="body2">Collaborative Mission: Zinneke Rescue Mission</Typography>
            <Typography variant="body2">Enrollment Timestamp: {new Date(previewData?.timestamp * 1000).toLocaleString()}</Typography>
            <Typography variant="body2">Official Attester: mission-enrollment.base.eth</Typography>
            <Typography variant="body2">Official Attester: mission-enrollment.base.eth</Typography>
            <Typography variant="body2">Proof Verification: EAS Protocol</Typography>
          </Box>
        )}

        {chainId !== BASE_SEPOLIA_CHAIN_ID && address && (
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
        {address && (
          <Button
            variant="outlined"
            onClick={() => {
              if (address) {
                setPreviewData({
                  userAddress: address,
                  verifiedName,
                  poapVerified,
                  timestamp: Math.floor(Date.now() / 1000)
                });
              }
            }}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Preview Attestation
          </Button>
        )}

        {/* Create Attestation Button */}
        {address && previewData && (
          <Button
            variant="contained"
            onClick={createAttestation}
            disabled={loading || chainId !== BASE_SEPOLIA_CHAIN_ID}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Attestation'}
          </Button>
        )}

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
