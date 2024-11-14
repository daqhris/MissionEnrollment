import React from 'react';
import { GET_ATTESTATION_BY_ID, GET_RECENT_ATTESTATIONS } from '../../../graphql/queries';
import { ClientAttestationView } from '../../../components/ClientAttestationView';
import { ApolloWrapper } from '../../../components/ApolloWrapper';
import { apolloClient } from '../../../services/apollo/apolloClient';

// Generate static paths for recent attestations
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

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Server component that wraps the client component
export default function AttestationPage({ params }: Props) {
  return (
    <ApolloWrapper>
      <ClientAttestationView id={params.id} />
    </ApolloWrapper>
  );
}
