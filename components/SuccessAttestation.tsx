import React from 'react';

interface SuccessAttestationProps {
  attestationId: string;
  verifiedName: string;
  role: string;
}

export function SuccessAttestation({ attestationId, verifiedName, role }: SuccessAttestationProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Mission Enrollment Complete</h2>
      <div className="card bg-success/10 shadow-lg">
        <div className="card-body">
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Congratulations! Your enrollment has been recorded on Base Sepolia.</span>
          </div>

          <div className="mt-4">
            <p className="text-lg mb-2">Enrolled as: <span className="font-semibold">{verifiedName}</span></p>
            <p className="text-lg mb-4">Role: <span className="font-semibold">{role}</span></p>
            <p className="text-sm text-base-content/70 mb-2">Attestation ID: {attestationId}</p>
            <a
              href={`https://base-sepolia.easscan.org/attestation/view/${attestationId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on EAS Explorer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
