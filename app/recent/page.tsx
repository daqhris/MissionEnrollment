'use client';

import React, { Suspense } from 'react';
import { RecentAttestationsView } from '../../components/RecentAttestationsView';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Error Loading Attestations</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function RecentAttestationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Attestations</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <RecentAttestationsView title="Recent Attestations" pageSize={20} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
