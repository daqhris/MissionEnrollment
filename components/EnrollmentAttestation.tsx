import { useState } from 'react';
import { useAccount, useChainId, useWalletClient, usePublicClient } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { EAS, SchemaEncoder, type AttestationRequest } from "@ethereum-attestation-service/eas-sdk";
import { Interface } from '@ethersproject/abi';
import { Card, CardContent, Typography, Button, CircularProgress, Box, Link } from '@mui/material';
import NetworkSwitchButton from './NetworkSwitchButton';
import { BASE_SEPOLIA_CHAIN_ID, EAS_CONTRACT_ADDRESS, SCHEMA_UID } from '../utils/constants';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationUID: string) => void;
}

type AttestationError = {
  message: string;
  code?: number;
};

interface TransactionReceipt {
  transactionHash: string;
  logs: Array<{
    topics: string[];
    data: string;
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;
    address: string;
    logIndex: number;
  }>;
  blockNumber: number;
  blockHash: string;
  status: number;
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

      // Wait for transaction confirmation and handle the EAS transaction receipt
      const receipt = (await tx.wait()) as unknown as TransactionReceipt;
      console.log('Transaction confirmed:', receipt);

      if (receipt.transactionHash) {
        setTransactionHash(receipt.transactionHash);
      }

      // Parse logs if available
      if (receipt.logs && receipt.logs.length > 0) {
        const iface = new Interface([
          "event AttestationCreated(address indexed creator, bytes32 indexed uid)"
        ]);

        const attestEvent = receipt.logs
          .map((log) => {
            try {
              return iface.parseLog({
                topics: log.topics,
                data: log.data
              });
            } catch (e) {
              console.error('Error parsing log:', e);
              return null;
            }
          })
          .find((event) => event && event.name === 'AttestationCreated');

        if (attestEvent?.args?.uid) {
          console.log('Attestation created:', {
            creator: attestEvent.args.creator,
            uid: attestEvent.args.uid
          });
          onAttestationComplete(attestEvent.args.uid);
        }
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

        {!address && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Please connect your wallet to continue
            </Typography>
            <ConnectWallet />
          </Box>
        )}

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
            onClick={() => setPreviewData({
              userAddress: address,
              verifiedName,
              poapVerified,
              timestamp: Math.floor(Date.now() / 1000)
            })}
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
