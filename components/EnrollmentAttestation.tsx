import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import NetworkSwitchButton from './NetworkSwitchButton';
import {
  EAS_CONTRACT_ADDRESS_SEPOLIA,
  SCHEMA_UID,
  MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
  getRequiredNetwork,
  BASE_SEPOLIA_CHAIN_ID
} from '../utils/constants';
import { SCHEMA_ENCODING } from '../types/attestation';
import { getPOAPRole } from '../utils/poap';
import { BrowserProvider } from 'ethers';

interface EnrollmentAttestationProps {
  verifiedName: string;
}

interface PreviewData {
  userAddress: string;
  verifiedName: string;
  proofMethod: string;
  eventName: string;
  eventType: string;
  assignedRole: string;
  missionName: string;
  timestamp: number;
  attester: string;
  proofProtocol: string;
}

export default function EnrollmentAttestation({ verifiedName }: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const initializePreviewData = useCallback(async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);  // Add loading state
      const role = await getPOAPRole(address);
      const timestamp = Math.floor(Date.now() / 1000);

      setPreviewData({
        userAddress: address,
        verifiedName,
        proofMethod: "Basename Protocol",
        eventName: "ETHGlobal Brussels 2024",
        eventType: "International Hackathon",
        assignedRole: role,
        missionName: "Zinneke Rescue Mission",
        timestamp,
        attester: MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
        proofProtocol: "EAS Protocol"
      });
      setLoading(false);  // Clear loading state
    } catch (error) {
      console.error('Error initializing preview data:', error);
      setError('Failed to initialize preview data. Please try again.');
      setLoading(false);  // Clear loading state on error
    }
  }, [address, verifiedName]);

  const handleError = (error: any) => {
    console.error('Attestation error:', {
      message: error.message,
      code: (error as any).code,
      details: error,
      stack: error.stack
    });

    if (error.code === 4001) {
      setError('Transaction rejected by user');
    } else if (error.code === 4902) {
      setError(`Please add ${getRequiredNetwork('attestation').name} to your wallet`);
    } else if (error.code === -32603) {
      setError('Internal JSON-RPC error. Please check your wallet connection');
    } else if (error.message?.includes('network')) {
      setError(`Please switch to ${getRequiredNetwork('attestation').name} to create attestations`);
    } else if (error.message?.includes('invalid signer')) {
      setError('Invalid signer. Please check your wallet connection.');
    } else if (error.message?.includes('user rejected') || error.message?.includes('User rejected')) {
      setError('Transaction was rejected. Please try again.');
    } else {
      setError(`Failed to create attestation: ${error.message || 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleNetworkSwitch = async () => {
    try {
      console.log('Initiating network switch to Base Sepolia...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
      console.log('Network switch request sent successfully');
      // Add delay to allow network switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (switchError: any) {
      console.error('Network switch error:', switchError);
      handleError(switchError);
    }
  };

  const createAttestation = async () => {
    console.log('Starting attestation creation...', {
      address,
      chainId,
      hasPreviewData: !!previewData,
      currentNetwork: chainId
    });

    if (!previewData) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Initializing EAS with contract address:', EAS_CONTRACT_ADDRESS_SEPOLIA);
      const eas = new EAS(EAS_CONTRACT_ADDRESS_SEPOLIA);

      console.log('Creating provider and signer...');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log('Connecting signer to EAS...');
      await eas.connect(signer);

      console.log('Checking network...');
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
        console.log('Network mismatch, initiating switch...');
        await handleNetworkSwitch();
        // Wait for network switch and verify
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newNetwork = await provider.getNetwork();
        if (newNetwork.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
          throw new Error('Network switch failed or was cancelled');
        }
      }

      const schemaEncoder = new SchemaEncoder(SCHEMA_ENCODING);
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: previewData.userAddress, type: "address" },
        { name: "verifiedName", value: previewData.verifiedName, type: "string" },
        { name: "proofMethod", value: previewData.proofMethod, type: "string" },
        { name: "eventName", value: previewData.eventName, type: "string" },
        { name: "eventType", value: previewData.eventType, type: "string" },
        { name: "assignedRole", value: previewData.assignedRole, type: "string" },
        { name: "missionName", value: previewData.missionName, type: "string" },
        { name: "timestamp", value: previewData.timestamp, type: "uint256" },
        { name: "attester", value: previewData.attester, type: "address" },
        { name: "proofProtocol", value: previewData.proofProtocol, type: "string" }
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: previewData.userAddress,
          data: encodedData,
          value: BigInt(0),
        },
      });

      setLoading(false);
      return tx;
    } catch (err: any) {
      console.error('Error creating attestation:', err);
      handleError(err);
      return null;
    }
  };

  const checkNetworkAndContract = useCallback(async () => {
    if (!address) return;

    const currentChain = chainId;
    const requiredChain = getRequiredNetwork('attestation').id;  // Changed from 'verification' to 'attestation'

    if (currentChain !== requiredChain) {
      setError(`Please connect to Base Sepolia for attestation creation`);
      return;
    }

    setError(null);
    await initializePreviewData();
  }, [address, chainId, initializePreviewData]);

  useEffect(() => {
    checkNetworkAndContract();
  }, [address, chainId, checkNetworkAndContract]);

  useEffect(() => {
    const handleNetworkChange = () => {
      checkNetworkAndContract();
    };

    window.addEventListener('networkChanged', handleNetworkChange);
    return () => window.removeEventListener('networkChanged', handleNetworkChange);
  }, [checkNetworkAndContract]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Mission Enrollment Attestation
        </Typography>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Identity Check
              </Typography>
              <Typography>
                User Address: {previewData?.userAddress || 'Not connected'}
              </Typography>
              <Typography>
                Public Identity: {previewData?.verifiedName || 'Not verified'}
              </Typography>
              <Typography>
                Proof Verification Method: {previewData?.proofMethod}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Event Attendance
              </Typography>
              <Typography>
                Event Name: {previewData?.eventName}
              </Typography>
              <Typography>
                Event Type: {previewData?.eventType}
              </Typography>
              <Typography>
                Assigned Role: {previewData?.assignedRole || 'Not verified'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Early Registration
              </Typography>
              <Typography>
                Collaborative Mission: {previewData?.missionName}
              </Typography>
              <Typography>
                Enrollment Timestamp: {previewData?.timestamp ? new Date(previewData.timestamp).toLocaleString() : 'Not set'}
              </Typography>
              <Typography>
                Official Attester: {previewData?.attester}
              </Typography>
              <Typography>
                Proof Verification: {previewData?.proofProtocol}
              </Typography>
            </Box>

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={createAttestation}
                disabled={
                  !address ||
                  !previewData ||
                  loading ||
                  chainId !== BASE_SEPOLIA_CHAIN_ID
                }
              >
                {chainId !== BASE_SEPOLIA_CHAIN_ID ? 'Switch to Base Sepolia First' : 'Create Attestation'}
              </Button>
              <NetworkSwitchButton
                targetChainId={getRequiredNetwork('attestation').id}
                action="attestation"
                onSuccess={() => setError(null)}
                onError={(error) => setError(error.message)}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
