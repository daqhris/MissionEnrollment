import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

interface EnrollmentAttestationProps {
  verifiedName: string;
  poapVerified: boolean;
  onAttestationComplete: (attestationId: string) => void;
}

const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021'; // Base Mainnet EAS Contract
const SCHEMA_UID = '0x'; // TODO: Add schema UID from deployed contract

export default function EnrollmentAttestation({
  verifiedName,
  poapVerified,
  onAttestationComplete
}: EnrollmentAttestationProps) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAttestation = async () => {
    if (!address || !verifiedName || !poapVerified) {
      setError('Missing required information for attestation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const eas = new EAS(EAS_CONTRACT_ADDRESS);

      // Initialize SchemaEncoder with the schema string from the smart contract
      const schemaEncoder = new SchemaEncoder("address userAddress,uint256 tokenId,uint256 timestamp,address attester");

      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "tokenId", value: 1, type: "uint256" }, // TODO: Get actual token ID
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
        { name: "attester", value: address, type: "address" }
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: 0,
          revocable: true,
          data: encodedData,
        },
      });

      const attestationUID = await tx.wait();
      onAttestationComplete(attestationUID);
    } catch (err) {
      console.error('Error creating attestation:', err);
      setError('Failed to create attestation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enrollment Attestation</h2>
        <p className="text-sm mb-4">Create an onchain attestation for your mission enrollment.</p>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Verified Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={verifiedName}
              disabled
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">POAP Verification</span>
            </label>
            <div className={`badge ${poapVerified ? 'badge-success' : 'badge-error'}`}>
              {poapVerified ? 'Verified' : 'Not Verified'}
            </div>
          </div>

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
