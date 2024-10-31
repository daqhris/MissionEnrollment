import { useState } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
}

const EAS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS || '0x4200000000000000000000000000000000000021';
const SCHEMA_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS || '0x4200000000000000000000000000000000000020';
const SCHEMA_UID = '0x0000000000000000000000000000000000000000000000000000000000000000'; // Will be updated after deployment

export default function EnrollmentAttestation({
  verifiedName,
  poapVerified,
  onAttestationComplete,
}: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAttestation = async () => {
    if (!address || !poapVerified) {
      setError('Wallet not connected or POAP verification incomplete');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Connect to Base Sepolia
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
      );

      // Initialize EAS SDK
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(provider);

      // Create SchemaEncoder instance
      const schemaEncoder = new SchemaEncoder("address userAddress,string verifiedName,bool poapVerified,uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "verifiedName", value: verifiedName, type: "string" },
        { name: "poapVerified", value: poapVerified, type: "bool" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
      ]);

      // Create the attestation
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      console.log("New attestation created with UID:", newAttestationUID);
      onAttestationComplete(newAttestationUID);

    } catch (err) {
      console.error('Error creating attestation:', err);
      setError('Failed to create attestation. Please try again.');
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
