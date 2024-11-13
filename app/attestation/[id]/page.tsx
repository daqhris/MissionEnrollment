'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AttestationCard } from '../../../components/AttestationCard';

interface AttestationData {
  id: string;
  decodedDataJson: string;
  time: string;
  attester: string;
}

export default function AttestationPage() {
  const params = useParams();
  const [attestation, setAttestation] = useState<AttestationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttestation = async () => {
      try {
        // TODO: Implement GraphQL query for single attestation
        const response = await fetch(`/api/attestation/${params.id}`);
        const data = await response.json();
        setAttestation(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch attestation');
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAttestation();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!attestation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Attestation not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Attestation Details</h1>
      <AttestationCard attestation={attestation} />
    </div>
  );
}
