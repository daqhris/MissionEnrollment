import { Metadata } from "next";
import { getPageMetadata } from "../../../utils/seo/getPageMetadata";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return getPageMetadata('attestation', params);
}

import React from 'react';
import { GET_ENROLLMENTS } from '../../../graphql/queries';
import { ClientAttestationView } from '../../../components/ClientAttestationView';
import { ApolloWrapper } from '../../../components/ApolloWrapper';
import { apolloClient } from '../../../services/apollo/apolloClient';
import { SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED } from '../../../utils/constants';

// Generate static paths for recent attestations
export async function generateStaticParams() {
  try {
    const { data } = await apolloClient.query({
      query: GET_ENROLLMENTS,
      variables: {
        take: 100, // Pre-generate paths for the 100 most recent attestations
        skip: 0,
        schemaIds: [SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED]
      },
    });

    return data.attestations.map((attestation: { id: string }) => ({
      id: attestation.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [
      { id: '0x0000000000000000000000000000000000000000000000000000000000000001' },
      { id: '0x0000000000000000000000000000000000000000000000000000000000000002' },
      { id: '0x0000000000000000000000000000000000000000000000000000000000000003' }
    ];
  }
}

// Server component that wraps the client component
export default async function AttestationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ApolloWrapper>
      <ClientAttestationView id={params.id} />
    </ApolloWrapper>
  );
}
