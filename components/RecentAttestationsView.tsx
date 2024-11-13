'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECENT_ATTESTATIONS } from '../graphql/queries';
import { Spinner } from './assets/Spinner';

interface RecentAttestationsViewProps {
  title: string;
  pageSize?: number;
}

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): React.ReactElement {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const { loading, error: queryError, data } = useQuery(GET_RECENT_ATTESTATIONS, {
    variables: {
      take: pageSize,
      skip: (page - 1) * pageSize,
      attester: null
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('[RecentAttestationsView] GraphQL Error:', error);
      setError(error);
    }
  });

  // Handle initial loading state
  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  // Handle error state
  if (queryError || error) {
    const errorMessage = queryError?.message || error?.message || 'An unknown error occurred';
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold mb-2">Error Loading Attestations</h2>
        <pre className="text-sm overflow-auto">{errorMessage}</pre>
      </div>
    );
  }

  // Safely access data with fallbacks
  const attestations = data?.attestations || [];
  const totalCount = data?.attestationsCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

      {attestations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No attestations found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {attestations.map((attestation: any) => (
              <div key={attestation.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="font-medium">Attester: {attestation?.attester || 'Unknown'}</p>
                <p className="text-sm text-gray-600">
                  Time: {attestation?.time ? new Date(attestation.time * 1000).toLocaleString() : 'Unknown'}
                </p>
                {attestation?.decodedDataJson && (
                  <pre className="text-sm bg-gray-50 p-2 mt-2 rounded overflow-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(attestation.decodedDataJson), null, 2);
                      } catch (e) {
                        return 'Invalid JSON data';
                      }
                    })()}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
