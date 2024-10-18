import React, { useState } from "react";
import { OnchainAttestationProps } from '../types';

const OnchainAttestation: React.FC<OnchainAttestationProps> = ({ onAttestationComplete, poaps }) => {
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);

  const handleAttestation = async (): Promise<void> => {
    try {
      // Simplified attestation logic
      setAttestationStatus("Attestation successful");
      onAttestationComplete("dummy-attestation-uid");
    } catch (error) {
      console.error("Error creating attestation:", error);
      setAttestationStatus("Error creating attestation");
    }
  };

  return (
    <div>
      <h2>Onchain Attestation</h2>
      <p>Status: {attestationStatus}</p>
      <button onClick={handleAttestation}>Create Attestation</button>
    </div>
  );
};

export default OnchainAttestation;
