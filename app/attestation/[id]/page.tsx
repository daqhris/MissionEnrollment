import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../../services/apollo/apolloClient';
import { GET_ATTESTATION_BY_ID, GET_RECENT_ATTESTATIONS } from '../../../graphql/queries';
import { ClientAttestationView } from '../../../components/ClientAttestationView';

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

export default function AttestationPage({ params }: { params: { id: string } }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ClientAttestationView id={params.id} />
    </ApolloProvider>
  );
}
