'use client';

import React from 'react';
import { RecentAttestationsView } from '../../components/RecentAttestationsView';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  console.error('[RecentAttestationsPage] Error:', error);
  return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Error Loading Attestations</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
    </div>
  );
}

export default function RecentAttestationsPage() {
  console.log('[RecentAttestationsPage] Rendering page');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Attestations</h1>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error) => {
          console.error('[RecentAttestationsPage] ErrorBoundary caught:', error);
        }}
      >
        <RecentAttestationsView title="Recent Attestations" pageSize={20} />
      </ErrorBoundary>
    </div>
  );
}
