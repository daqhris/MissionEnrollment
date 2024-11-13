'use client';

import React from 'react';
import { RecentAttestationsView } from '../../components/RecentAttestationsView';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../services/apollo/apolloClient';

export default function RecentAttestationsPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Recent Attestations</h1>
        <RecentAttestationsView title="Recent Attestations" pageSize={20} />
      </div>
    </ApolloProvider>
  );
}
