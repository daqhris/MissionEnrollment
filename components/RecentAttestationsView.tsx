'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import type { Attestation } from '../types/attestation';
import { AttestationCard } from './AttestationCard';
import { Spinner } from './assets/Spinner';
import { GET_RECENT_ATTESTATIONS } from '../graphql/queries';

interface RecentAttestationsViewProps {
  title: string;
  pageSize?: number;
}

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): React.ReactElement {
  const { loading, error, data } = useQuery(GET_RECENT_ATTESTATIONS, {
    variables: {
      take: pageSize,
      skip: 0,
    },
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('GraphQL query error:', error);
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading attestations: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      {data?.attestations?.length > 0 ? (
        <div className="space-y-6">
          {data.attestations.map((attestation: any) => (
            <div key={attestation.id} className="bg-white rounded-lg shadow-md p-6">
              <AttestationCard
                attestation={{
                  id: attestation.id,
                  attester: attestation.attester,
                  recipient: attestation.recipient,
                  refUID: attestation.refUID,
                  revocable: attestation.revocable,
                  revocationTime: attestation.revocationTime,
                  expirationTime: attestation.expirationTime,
                  data: attestation.data || '',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No attestations found
        </div>
      )}
    </div>
  );
}
