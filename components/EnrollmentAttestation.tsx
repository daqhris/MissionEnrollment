import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Card, CardContent, Typography, Button, CircularProgress, Box, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { notification } from "../utils/scaffold-eth";
import {
  EAS_CONTRACT_ADDRESS,
  SCHEMA_UID,
  MISSION_ENROLLMENT_BASE_ETH_ADDRESS,
  getRequiredNetwork,
  BASE_SEPOLIA_CHAIN_ID,
  BASE_MAINNET_CHAIN_ID,
  NETWORK_CONFIG
} from '../utils/constants';
import { MainnetSupportBanner } from './MainnetSupportBanner';
import { useUserNetworkPreference } from '../hooks/useUserNetworkPreference';
import { SCHEMA_ENCODING } from '../types/attestation';
import { getPOAPRole } from '../utils/poap';
import { BrowserProvider, TransactionReceipt, Log, Interface } from 'ethers';
import { useNetworkSwitch } from '../hooks/useNetworkSwitch';
import { generateVerificationSignature, generateVerificationHash, signVerification } from '../utils/attestationVerification';
import { formatTimestamp } from '../utils/formatting';

interface EnrollmentAttestationProps {
  approvedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
  attestationId?: string | null;
}

enum WalletStep {
  IDLE = 'idle',
  SIGNING = 'signing',
  TRANSACTION = 'transaction',
  COMPLETE = 'complete'
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
  const [walletStep, setWalletStep] = useState<WalletStep>(WalletStep.IDLE);
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
      const timestamp = Date.now(); // Use milliseconds for proper date display

      let eventName = "ETHGlobal Brussels 2024";
      let eventTypeDisplay = "International Hackathon";

      if (eventType === 'ETHDENVER_COINBASE_CDP_2025') {
        eventName = "ETHDenver Coinbase CDP 2025";
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
    } else if (error.message?.includes('user rejected') || error.message?.includes('User rejected') || error.message?.includes('user denied') || error.code === 4001) {
      notification.error('Transaction cancelled. You can try again when ready.');
      setError('Transaction cancelled. You can try again when ready.');
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

      setWalletStep(WalletStep.SIGNING);
      notification.info("Please sign the identity verification message in your wallet");
      
      const messageData = {
        userAddress: previewData.userAddress,
        eventName: previewData.eventName,
        role: previewData.assignedRole,
        verifiedName: previewData.approvedName,
        timestamp: previewData.timestamp
      };

      console.log("EIP-712 message data:", messageData);

      let signature;
      try {
        signature = await signVerification(signer, previewData.userAddress, {
          eventName: previewData.eventName,
          role: previewData.assignedRole,
          verifiedName: previewData.approvedName
        });
        
        console.log("EIP-712 signature:", signature);
      } catch (error) {
        console.error("EIP-712 signing error:", error);
        setError(`Failed to create attestation: ${error instanceof Error ? error.message : 'Wallet signing error'}`);
        setWalletStep(WalletStep.IDLE);
        setLoading(false);
        return;
      }

      setWalletStep(WalletStep.TRANSACTION);
      notification.info("Please confirm the transaction to create your on-chain attestation");
      
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
        { name: "verificationSignature", value: signature, type: "string" }, // Use the actual signature
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

      setWalletStep(WalletStep.COMPLETE);
      notification.success("Successfully created attestation!");
      onAttestationComplete(newAttestationId);
      setLoading(false);
    } catch (err) {
      handleError(err);
      setWalletStep(WalletStep.IDLE);
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
      padding: { xs: '0.75rem', md: '1.5rem' },
      width: { xs: '100%', sm: 'auto' }
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ 
          color: '#957777', 
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Enrollment for Zinneke Rescue Mission
        </Typography>

        {preferredNetwork && chainId !== preferredNetwork && (
          <Typography color="warning.main" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Your wallet is connected to {NETWORK_CONFIG[chainId]?.name || 'an unknown network'}, but you've selected {NETWORK_CONFIG[preferredNetwork]?.name || 'another network'} for attestations.
          </Typography>
        )}

        <Typography paragraph sx={{ 
          color: '#ffffff', 
          marginBottom: 2,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          Mission Enrollment is the official onboarding portal for the upcoming Zinneke Rescue Mission on the Base blockchain.
          <br />
          Complete the steps below to secure your place in this collaborative artistic mission.
        </Typography>
        
        {/* Wallet interaction explanation */}
        <Box sx={{ 
          mb: 2, 
          p: { xs: 1.5, sm: 2 }, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '0.5rem' 
        }}>
          <Typography variant="subtitle1" sx={{ 
            color: '#ffffff', 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Wallet Interaction Guide
          </Typography>
          <Typography sx={{ 
            color: '#ffffff', 
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Creating your attestation requires two wallet interactions:
          </Typography>
          <Typography component="ol" sx={{ 
            color: '#ffffff', 
            fontSize: { xs: '0.8rem', sm: '0.9rem' }, 
            pl: 2 
          }}>
            <li>First, you'll sign a message to verify your identity (shows your name and role)</li>
            <li>Then, you'll confirm a transaction to create your attestation on the blockchain</li>
          </Typography>
        </Box>
        
        {/* Wallet step indicator */}
        {(walletStep !== WalletStep.IDLE && !attestationId) && (
          <Box sx={{ mb: 2 }}>
            <Stepper 
              activeStep={walletStep === WalletStep.SIGNING ? 0 : walletStep === WalletStep.TRANSACTION ? 1 : 2} 
              alternativeLabel
              sx={{ 
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            >
              <Step>
                <StepLabel>Identity Verification</StepLabel>
              </Step>
              <Step>
                <StepLabel>On-chain Attestation</StepLabel>
              </Step>
              <Step>
                <StepLabel>Complete</StepLabel>
              </Step>
            </Stepper>
            
            <Alert severity={walletStep === WalletStep.SIGNING ? "info" : walletStep === WalletStep.TRANSACTION ? "warning" : "success"} sx={{ 
              mt: 2,
              '& .MuiAlert-message': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}>
              {walletStep === WalletStep.SIGNING && "Please sign the identity verification message in your wallet. This confirms your name and role."}
              {walletStep === WalletStep.TRANSACTION && "Please confirm the transaction in your wallet to create your on-chain attestation."}
              {walletStep === WalletStep.COMPLETE && "Your attestation has been successfully created on the blockchain!"}
            </Alert>
          </Box>
        )}

        {error && (
          <Typography color="error" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {error}
          </Typography>
        )}

        {networkError && (
          <Typography color="error" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {networkError}
          </Typography>
        )}

        {loading || isNetworkSwitching ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={24} />
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
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'rgb(17, 24, 39)', 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Identity Check
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                wordBreak: 'break-all'
              }}>
                User Address: {previewData?.userAddress || 'Not connected'}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Onchain Name: {previewData?.approvedName || 'Not approved'}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Proof Method: {previewData?.proofMethod}
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
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'rgb(17, 24, 39)', 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Event Attendance
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Event Name: {previewData?.eventName}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Event Type: {previewData?.eventType}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
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
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'rgb(17, 24, 39)', 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Mission Registration
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Collaborative Mission: <span style={{ fontWeight: 600 }}>{previewData?.missionName}</span>
              </Typography>

              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Public Attester: {previewData?.attester}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Proof Protocol: {previewData?.proofProtocol}
              </Typography>
              <Typography sx={{ 
                color: 'rgb(31, 41, 55)',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                Schema Deployer: {previewData?.verificationSource}
              </Typography>
            </Box>

            <Box mt={3} display="flex" flexDirection="column" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={createAttestation}
                disabled={!address || !previewData || loading || isNetworkSwitching || networkSwitched || !!attestationId}
                sx={{ 
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '80%', md: '60%' },
                  opacity: walletStep !== WalletStep.IDLE && walletStep !== WalletStep.COMPLETE ? 0.7 : 1,
                  position: 'relative',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 1.5, sm: 2 }
                }}
                id="create-attestation-button"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <span className="text-sm">
                      {walletStep === WalletStep.SIGNING && "Waiting for signature..."}
                      {walletStep === WalletStep.TRANSACTION && "Creating attestation..."}
                      {walletStep === WalletStep.IDLE && "Loading..."}
                    </span>
                  </>
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
              
              {/* Additional explanation about the button */}
              {!loading && !attestationId && (
                <Typography sx={{ 
                  color: '#ffffff', 
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }, 
                  mt: 1, 
                  textAlign: 'center',
                  maxWidth: '90%'
                }}>
                  Clicking this button will start the attestation process
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
