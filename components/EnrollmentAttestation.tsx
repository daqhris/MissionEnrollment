import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import NetworkSwitchButton from './NetworkSwitchButton';
import { notification } from "../utils/scaffold-eth";
import {
  EAS_CONTRACT_ADDRESS_SEPOLIA,
  SCHEMA_UID,
  MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
  getRequiredNetwork,
  BASE_SEPOLIA_CHAIN_ID
} from '../utils/constants';
import { SCHEMA_ENCODING } from '../types/attestation';
import { getPOAPRole } from '../utils/poap';
import { BrowserProvider, TransactionReceipt, Log, Interface } from 'ethers';

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

  const handleNetworkSwitch = async () => {
    try {
      notification.info("Switching to Base Sepolia network...");
      console.log('Initiating network switch to Base Sepolia...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
      notification.success("Successfully switched to Base Sepolia");
      console.log('Network switch request sent successfully');
      // Add delay to allow network switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (switchError: any) {
      console.error('Network switch error:', switchError);
      handleError(switchError);
    }
  };

  const createAttestation = async () => {
    let notificationId = null;
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

      notificationId = notification.loading("Preparing attestation...");
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
        notification.remove(notificationId);
        console.log('Network mismatch, initiating switch...');
        await handleNetworkSwitch();
        // Wait for network switch and verify
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newNetwork = await provider.getNetwork();
        if (newNetwork.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
          throw new Error('Network switch failed or was cancelled');
        }
        notificationId = notification.loading("Preparing attestation...");
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

      notification.remove(notificationId);
      notificationId = notification.loading("Please sign the transaction to create attestation...");
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: previewData.userAddress,
          data: encodedData,
          value: BigInt(0),
        },
      });

      notification.remove(notificationId);
      notificationId = notification.loading("Waiting for transaction confirmation...");
      console.log('Waiting for transaction confirmation...');
      const attestationUID = await tx.wait();

      if (!attestationUID) {
        console.error('Failed to get attestation UID');
        throw new Error('Failed to get attestation UID from transaction');
      }

      notification.remove(notificationId);
      notification.success("🎉 Attestation created successfully!");
      console.log('Attestation created successfully:', attestationUID);
      setLoading(false);
      return attestationUID;
    } catch (err: any) {
      console.error('Error creating attestation:', {
        error: err,
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      if (notificationId) {
        notification.remove(notificationId);
      }
      handleError(err);
      setLoading(false);
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
    <Card sx={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '0.5rem',
      transition: 'box-shadow 0.2s'
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: 'rgb(17, 24, 39)', fontWeight: 600 }}>
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
            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: '0.5rem',
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
                Public Identity: {previewData?.verifiedName || 'Not verified'}
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Proof Verification Method: {previewData?.proofMethod}
              </Typography>
            </Box>

            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: '0.5rem',
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
                Assigned Role: {previewData?.assignedRole || 'Not verified'}
              </Typography>
            </Box>

            <Box mb={2} sx={{
              backgroundColor: 'rgb(254, 242, 242)',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              '&:hover': {
                backgroundColor: 'rgb(254, 226, 226)',
                transition: 'background-color 200ms'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgb(17, 24, 39)', fontWeight: 600 }}>
                Early Registration
              </Typography>
              <Typography sx={{ color: 'rgb(31, 41, 55)' }}>
                Collaborative Mission: {previewData?.missionName}
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
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Create Attestation'
                )}
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
