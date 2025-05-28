'use client';

import React from 'react';
import { EnrollmentsView } from '../../components/EnrollmentsView';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientLayout } from '../../components/ClientLayout';

function ErrorFallback({ error }: { error: Error }) {
  console.error('[EnrollmentsPage] Error:', error);
  return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Error Loading Enrollments</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
    </div>
  );
}

export default function EnrollmentsPage() {
  console.log('[EnrollmentsPage] Rendering page');

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Recent Enrollments</h1>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error) => {
            console.error('[EnrollmentsPage] ErrorBoundary caught:', error);
          }}
        >
          <EnrollmentsView title="Onchain Attestations" pageSize={20} />
        </ErrorBoundary>
      </div>
    </ClientLayout>
  );
}
