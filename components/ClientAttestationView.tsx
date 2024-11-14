'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ATTESTATION_BY_ID } from '../graphql/queries';
import { Spinner } from './assets/Spinner';
import { AttestationCard } from './AttestationCard';

interface AttestationData {
  id: string;
  decodedDataJson: string;
  time: string;
  attester: string;
}

export function ClientAttestationView({ id }: { id: string }) {
  const { loading, error, data } = useQuery(GET_ATTESTATION_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading attestation: {error.message}
        </div>
      </div>
    );
  }

  if (!data?.attestation) {
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
      <AttestationCard attestation={data.attestation} />
    </div>
  );
}
