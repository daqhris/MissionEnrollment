'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../../services/apollo/apolloClient';
import { GET_ATTESTATION_BY_ID, GET_RECENT_ATTESTATIONS } from '../../../graphql/queries';
import { Spinner } from '../../../components/assets/Spinner';
import { AttestationCard } from '../../../components/AttestationCard';

interface AttestationData {
  id: string;
  decodedDataJson: string;
  time: string;
  attester: string;
}

export async function generateStaticParams() {
  try {
    const { data } = await apolloClient.query({
      query: GET_RECENT_ATTESTATIONS,
      variables: {
        take: 100, // Pre-generate paths for the 100 most recent attestations
        skip: 0,
        attester: null // Allow attestations from all attesters
      },
    });

    return data.attestations.map((attestation: { id: string }) => ({
      id: attestation.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return empty array if fetching fails
  }
}

function AttestationView() {
  const params = useParams();
  const { loading, error, data } = useQuery(GET_ATTESTATION_BY_ID, {
    variables: { id: params.id },
    skip: !params.id,
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

export default function AttestationPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <AttestationView />
    </ApolloProvider>
  );
}
