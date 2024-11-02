import { useState } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { JsonRpcProvider, Wallet, BrowserProvider } from 'ethers';
import { useAccount, useChainId, useWalletClient, useSwitchChain } from 'wagmi';
import { base } from 'viem/chains';

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
}

// EAS Contract on Base Sepolia
const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
// Schema UID for Mission Enrollment attestations on Base Sepolia
const SCHEMA_UID = '0x46a1e77e9f1d74c8c60c8d8bd8129947b3c5f4d3e6e9497ae2e4701dd8e2c401';

export default function EnrollmentAttestation({
  verifiedName,
  poapVerified,
  onAttestationComplete,
}: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAttestation = async () => {
    if (!address || !poapVerified || !walletClient) {
      setError('Wallet not connected or POAP verification incomplete');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if we're on Base chain and switch if needed
      if (chainId !== base.id) {
        try {
          await switchChain({ chainId: base.id });
          // Wait for chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            setError('Base network not configured in wallet. Please add Base network first.');
          } else {
            setError('Failed to switch to Base network. Please switch manually.');
          }
          return;
        }
      }

      // Create browser provider from wallet client
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // Verify signer is connected
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        setError('Signer address mismatch. Please check your wallet connection.');
        return;
      }

      // Initialize EAS SDK with wallet signer
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      await eas.connect(signer);

      // Create SchemaEncoder instance
      const schemaEncoder = new SchemaEncoder("address userAddress,string verifiedName,bool poapVerified,uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "verifiedName", value: verifiedName, type: "string" },
        { name: "poapVerified", value: poapVerified, type: "bool" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
      ]);

      // Create the attestation
      console.log('Creating attestation with data:', {
        schema: SCHEMA_UID,
        recipient: address,
        data: encodedData
      });

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          revocable: true,
          data: encodedData,
        },
      });

      console.log('Transaction submitted:', tx);
      const newAttestationUID = await tx.wait();
      console.log("New attestation created with UID:", newAttestationUID);
      onAttestationComplete(newAttestationUID);

    } catch (err: any) {
      console.error('Error creating attestation:', err);
      if (err.code === 'CHAIN_NOT_CONFIGURED') {
        setError('Please switch to Base network to create attestation.');
      } else if (err.code === 'USER_REJECTED_REQUEST') {
        setError('User rejected the transaction. Please try again.');
      } else if (err.message?.includes('invalid signer')) {
        setError('Invalid signer. Please ensure your wallet is properly connected and try again.');
      } else {
        setError(`Failed to create attestation: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enrollment Attestation</h2>
        <p>Create an onchain attestation for your mission enrollment</p>

        <div className="mt-4">
          <p><strong>Verified Name:</strong> {verifiedName}</p>
          <p><strong>POAP Verification:</strong> {poapVerified ? '✅ Verified' : '❌ Not Verified'}</p>
          <p><strong>Network:</strong> {chainId === base.id ? '✅ Base' : '❌ Please switch to Base network'}</p>
        </div>

        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={createAttestation}
            disabled={isLoading || !poapVerified}
          >
            {isLoading ? 'Creating Attestation...' : 'Create Attestation'}
          </button>
        </div>
      </div>
    </div>
  );
}
