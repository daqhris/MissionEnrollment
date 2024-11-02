import { useState } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from 'ethers';
import { useAccount, useChainId, useWalletClient, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'viem/chains';

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
      errorMessage = 'Invalid signer. Please ensure your wallet is properly connected and on Base Sepolia network.';
    } else if ((err as any).code === 'CHAIN_NOT_CONFIGURED') {
      errorMessage = 'Please switch to Base Sepolia network to create attestation.';
    } else if ((err as any).code === 4902) {
      errorMessage = 'Base Sepolia network not configured in wallet. Please add Base Sepolia first.';
    } else if (err.message.includes('user rejected transaction')) {
      errorMessage = 'Transaction was rejected. Please try again and confirm the transaction in your wallet.';
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
        console.log('Switching to Base Sepolia...');
        try {
          await switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID });
          setError('Please confirm the network switch to Base Sepolia and try again.');
          setLoading(false);
          return;
        } catch (err: any) {
          console.error('Chain switch error:', err);
          if (err.code === 4902) {
            throw new Error('Base Sepolia network not configured in wallet. Please add Base Sepolia first.');
          }
          throw new Error(`Failed to switch to Base Sepolia: ${err.message}`);
        }
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

      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      // The transaction hash serves as a unique identifier for the attestation
      const attestationId = receipt.hash;
      console.log('Attestation created successfully!', attestationId);
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
      {chainId !== BASE_SEPOLIA_CHAIN_ID && (
        <div className="text-yellow-600 text-sm mb-2">
          Note: This attestation will be created on Base Sepolia network. Please switch networks when prompted.
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      {success && (
        <div className="text-green-500 text-sm mt-2">
          Attestation created successfully on Base Sepolia!
        </div>
      )}
      <button
        onClick={createAttestation}
        disabled={loading || !address}
        className={`px-4 py-2 rounded ${loading || !address ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
      >
        {loading ? 'Creating Attestation...' : 'Create Attestation'}
      </button>
    </div>
  );
}
