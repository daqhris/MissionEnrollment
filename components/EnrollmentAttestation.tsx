import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { notification } from "../utils/scaffold-eth";
import {
  EAS_CONTRACT_ADDRESS,
  SCHEMA_UID,
  MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
  getRequiredNetwork,
  BASE_SEPOLIA_CHAIN_ID,
  NETWORK_CONFIG
} from '../utils/constants';
import { useUserNetworkPreference } from '../hooks/useUserNetworkPreference';
import { SCHEMA_ENCODING } from '../types/attestation';
import { getPOAPRole } from '../utils/poap';
import { BrowserProvider, TransactionReceipt, Log, Interface } from 'ethers';
import { useNetworkSwitch } from '../hooks/useNetworkSwitch';
import { generateVerificationSignature, generateVerificationHash, signVerification } from '../utils/attestationVerification';

interface EnrollmentAttestationProps {
  approvedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
  attestationId?: string | null;
}

interface PreviewData {
  userAddress: string;
  approvedName: string;
  proofMethod: string;
  eventName: string;
  eventType: string;
  assignedRole: string;
  missionName: string;
  timestamp: number;
  attester: string;
  proofProtocol: string;
  verificationSource: string;
  verificationTimestamp: string;
  verificationSignature: string;
  verificationHash: string;
}

export default function EnrollmentAttestation({
  approvedName,
  poapVerified,
  onAttestationComplete,
  attestationId
}: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const { preferredNetwork } = useUserNetworkPreference();

  const {
    isLoading: isNetworkSwitching,
    error: networkError,
    networkSwitched,
    handleNetworkSwitch,
    targetNetwork
  } = useNetworkSwitch('attestation');

  const initializePreviewData = useCallback(async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);  // Add loading state
      const { role, eventType } = await getPOAPRole(address);
      const timestamp = Math.floor(Date.now() / 1000);

      let eventName = "ETHGlobal Brussels 2024";
      let eventTypeDisplay = "International Hackathon";

      if (eventType === 'ETHDENVER_COINBASE_2025') {
        eventName = "ETHDenver Coinbase 2025";
        eventTypeDisplay = "Developer Workshop & Hackathon";
      }

      const verificationSource = "mission-enrollment.base.eth";
      const verificationTimestamp = new Date().toISOString();
      const verificationSignature = generateVerificationSignature(address, { 
        eventName, 
        role, 
        verifiedName: approvedName 
      });
      const verificationHash = generateVerificationHash(address, { 
        eventName, 
        role, 
        verifiedName: approvedName 
      });

      setPreviewData({
        userAddress: address,
        approvedName,
        proofMethod: "Basename Protocol",
        eventName,
        eventType: eventTypeDisplay,
        assignedRole: role,
        missionName: "Zinneke Rescue Mission",
        timestamp,
        attester: MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
        proofProtocol: "EAS Schema #1157",
        verificationSource,
        verificationTimestamp,
        verificationSignature,
        verificationHash
      });
      setLoading(false);  // Clear loading state
    } catch (error) {
      console.error('Error initializing preview data:', error);
      setError('Failed to initialize preview data. Please try again.');
      setLoading(false);  // Clear loading state on error
    }
  }, [address, approvedName]);

  const handleError = (error: any) => {
    // Add receipt-specific error logging
    if (error.message?.includes('receipt') || error.message?.includes('attestation')) {
      console.error('Receipt/Attestation validation error:', {
        errorType: error.constructor.name,
        message: error.message,
        code: error.code,
        details: error,
        stack: error.stack
      });
    }
    console.error('Attestation error:', {
      message: error.message,
      code: (error as any).code,
      details: error,
      stack: error.stack
    });

    if (error.code === 4001) {
      notification.error('Transaction rejected by user');
      setError('Transaction rejected by user');
    } else if (error.code === 4902) {
      const networkName = getRequiredNetwork('attestation').name;
      notification.error(`Please add ${networkName} to your wallet`);
      setError(`Please add ${networkName} to your wallet`);
    } else if (error.code === -32603) {
      notification.error('Internal JSON-RPC error. Please check your wallet connection');
      setError('Internal JSON-RPC error. Please check your wallet connection');
    } else if (error.message?.includes('network')) {
      const networkName = getRequiredNetwork('attestation').name;
      notification.error(`Please switch to ${networkName} to create attestations`);
      setError(`Please switch to ${networkName} to create attestations`);
    } else if (error.message?.includes('invalid signer')) {
      notification.error('Invalid signer. Please check your wallet connection.');
      setError('Invalid signer. Please check your wallet connection.');
    } else if (error.message?.includes('user rejected') || error.message?.includes('User rejected')) {
      notification.error('Transaction was rejected. Please try again.');
      setError('Transaction was rejected. Please try again.');
    } else if (error.message?.includes('transaction failed')) {
      notification.error('Transaction failed. Please check your wallet and try again.');
      setError('Transaction failed. Please check your wallet and try again.');
    } else if (error.message?.includes('attestation UID')) {
      notification.error('Failed to get attestation ID. Please try again.');
      setError('Failed to get attestation ID. Please try again.');
    } else {
      notification.error(`Failed to create attestation: ${error.message || 'Unknown error'}`);
      setError(`Failed to create attestation: ${error.message || 'Unknown error'}`);
    }
    setLoading(false);
  };

  const createAttestation = useCallback(async () => {
    if (!address || !previewData) return;

    try {
      setLoading(true);
      setError(null);

      // Switch to user-preferred network if needed (now controlled by the useNetworkSwitch hook)
      const switchResult = await handleNetworkSwitch();
      if (!switchResult) {
        setLoading(false);
        return;
      }

      // Initialize EAS with the correct contract address based on network
      const easContractAddress = EAS_CONTRACT_ADDRESS(preferredNetwork);
      const eas = new EAS(easContractAddress);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      eas.connect(signer);

      const messageData = {
        userAddress: previewData.userAddress,
        eventName: previewData.eventName,
        role: previewData.assignedRole,
        verifiedName: previewData.approvedName,
        timestamp: previewData.timestamp
      };

      console.log("EIP-712 message data:", messageData);

      const signature = await signVerification(signer, previewData.userAddress, {
        eventName: previewData.eventName,
        role: previewData.assignedRole,
        verifiedName: previewData.approvedName
      });

      console.log("EIP-712 signature:", signature);

      const schemaEncoder = new SchemaEncoder(SCHEMA_ENCODING);
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: previewData.userAddress, type: "address" },
        { name: "verifiedName", value: previewData.approvedName, type: "string" },
        { name: "proofMethod", value: previewData.proofMethod, type: "string" },
        { name: "eventName", value: previewData.eventName, type: "string" },
        { name: "eventType", value: previewData.eventType, type: "string" },
        { name: "assignedRole", value: previewData.assignedRole, type: "string" },
        { name: "missionName", value: previewData.missionName, type: "string" },
        { name: "timestamp", value: previewData.timestamp, type: "uint256" },
        { name: "attester", value: previewData.attester, type: "address" },
        { name: "proofProtocol", value: previewData.proofProtocol, type: "string" },
        { name: "verificationSource", value: previewData.verificationSource, type: "string" },
        { name: "verificationTimestamp", value: previewData.verificationTimestamp, type: "string" },
        { name: "verificationSignature", value: previewData.verificationSignature, type: "string" },
        { name: "verificationHash", value: previewData.verificationHash, type: "string" }
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationId = await tx.wait();
      console.log("New attestation created with ID: ", newAttestationId);

      notification.success("Successfully created attestation!");
      onAttestationComplete(newAttestationId);
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [address, previewData, handleNetworkSwitch, onAttestationComplete, preferredNetwork]);

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
    <Card sx={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '0.5rem',
      transition: 'box-shadow 0.2s',
      margin: { xs: '0.5rem', md: '1rem' },
      padding: { xs: '0.75rem', md: '1.5rem' }
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#957777', fontWeight: 600 }}>
          Enrollment for Zinneke Rescue Mission
        </Typography>

        {preferredNetwork && chainId !== preferredNetwork && (
          <Typography color="warning.main" gutterBottom>
            Your wallet is connected to {NETWORK_CONFIG[chainId]?.name || 'an unknown network'}, but you've selected {NETWORK_CONFIG[preferredNetwork]?.name || 'another network'} for attestations.
          </Typography>
        )}

        <Typography paragraph sx={{ color: 'rgb(31, 41, 55)', marginBottom: 2 }}>
          Mission Enrollment is the official onboarding portal for the upcoming Zinneke Rescue Mission on the Base blockchain. Complete the steps below to secure your place in this collaborative artistic mission.
        </Typography>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        {networkError && (
          <Typography color="error" gutterBottom>
            {networkError}
          </Typography>
        )}

        {loading || isNetworkSwitching ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: { xs: '0.375rem', md: '0.5rem' },
              borderRadius: '0.375rem',
              '&:hover': {
                backgroundColor: 'rgb(254, 226, 226)',
                transition: 'background-color 200ms'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgb(17, 24, 39)', fontWeight: 600 }}>
                Identity Check
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                User Address: {previewData?.userAddress || 'Not connected'}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Public Identity: {previewData?.approvedName || 'Not approved'}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Proof Verification Method: {previewData?.proofMethod}
              </Typography>
            </Box>

            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: { xs: '0.375rem', md: '0.5rem' },
              borderRadius: '0.375rem',
              '&:hover': {
                backgroundColor: 'rgb(254, 226, 226)',
                transition: 'background-color 200ms'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgb(17, 24, 39)', fontWeight: 600 }}>
                Event Attendance
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Event Name: {previewData?.eventName}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Event Type: {previewData?.eventType}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Assigned Role: {previewData?.assignedRole || 'Not approved'}
              </Typography>
            </Box>

            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: { xs: '0.375rem', md: '0.5rem' },
              borderRadius: '0.375rem',
              '&:hover': {
                backgroundColor: 'rgb(254, 226, 226)',
                transition: 'background-color 200ms'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgb(17, 24, 39)', fontWeight: 600 }}>
                Mission Registration
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Collaborative Mission: <span style={{ fontWeight: 600 }}>{previewData?.missionName}</span> - The first artistic collaboration on Base blockchain
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Enrollment Timestamp: {previewData?.timestamp ? new Date(previewData.timestamp).toLocaleString() : 'Not set'}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Official Attester: {previewData?.attester}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Proof Verification: {previewData?.proofProtocol}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Verification Source: {previewData?.verificationSource}
              </Typography>
            </Box>

            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={createAttestation}
                disabled={!address || !previewData || loading || isNetworkSwitching || networkSwitched || !!attestationId}
                sx={{ width: '100%' }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : isNetworkSwitching ? (
                  'Switching Network...'
                ) : networkSwitched ? (
                  'Network Switched'
                ) : attestationId ? (
                  'Attestation Created'
                ) : (
                  'Create Attestation'
                )}
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
