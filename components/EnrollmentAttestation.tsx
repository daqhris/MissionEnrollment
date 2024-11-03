import React, { useState } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from 'ethers';
import { useAccount, useChainId, useWalletClient, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import NetworkSwitchButton from './NetworkSwitchButton';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

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
      console.log('Submitting attestation...');
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData
        }
      });

      console.log('Transaction submitted:', tx);
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // Extract attestation ID from transaction logs
      const attestationId = receipt.logs[0].topics[1];
      console.log('Extracted attestation ID:', attestationId);

      if (!attestationId) {
        throw new Error('Failed to extract attestation ID from transaction receipt');
      }

      setAttestationId(attestationId);
      onAttestationComplete(attestationId);
      setSuccess(true);
    } catch (err: any) {
      handleAttestationError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <h1 className="text-2xl font-bold mb-2">Enrollment Attestation</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Attestation Summary</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Verified Name:</span> {verifiedName}</p>
          <p><span className="font-medium">POAP Verification:</span> {poapVerified ? 'Verified' : 'Not Verified'}</p>
          <p><span className="font-medium">Wallet Address:</span> {address}</p>
          <p><span className="font-medium">Network:</span> Base Sepolia</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        To create your enrollment attestation, you need to be connected to the Base Sepolia network.
      </div>
      <NetworkSwitchButton className="mb-4" />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">
            Attestation created successfully on Base Sepolia!{' '}
            <a
              href={`https://base-sepolia.easscan.org/attestation/view/${attestationId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-800"
            >
              View on EAS Explorer
            </a>
          </span>
        </div>
      )}
      <button
        onClick={createAttestation}
        disabled={loading || !address || chainId !== BASE_SEPOLIA_CHAIN_ID}
        className={`px-4 py-2 rounded ${loading || !address || chainId !== BASE_SEPOLIA_CHAIN_ID ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
      >
        {loading ? 'Creating Attestation...' : 'Create Attestation'}
      </button>
    </div>
  );
}
