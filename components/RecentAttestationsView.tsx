'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECENT_ATTESTATIONS } from '../graphql/queries';
import { Spinner } from './assets/Spinner';
import { Attestation, AttestationData } from '../types/attestation';
import { ErrorBoundary } from 'react-error-boundary';
import { SCHEMA_UID } from '../utils/constants';
import { BaseNameDisplay } from './BaseNameDisplay';
import { formatAttestationData, getFieldLabel } from '../utils/formatting';

interface RecentAttestationsViewProps {
  title: string;
  pageSize?: number;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
    </div>
  );
}

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): React.ReactElement {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const { loading, error: queryError, data } = useQuery(GET_RECENT_ATTESTATIONS, {
    variables: {
      take: pageSize,
      skip: (page - 1) * pageSize,
      schemaId: SCHEMA_UID
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('[RecentAttestationsView] GraphQL Error:', error);
      setError(error);
    }
  });

  const content = () => {
    if (loading && !data) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if (queryError || error) {
      const errorMessage = queryError?.message || error?.message || 'An unknown error occurred';
      console.error('[RecentAttestationsView] Error fetching attestations:', errorMessage);
      return (
        <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200 alert alert-error">
          <h2 className="text-xl font-bold mb-2">Error Loading Attestations</h2>
          <p>Error loading attestations for schema {SCHEMA_UID}</p>
          <pre className="text-sm overflow-auto">{errorMessage}</pre>
        </div>
      );
    }

    const attestations = data?.attestations || [];
    const totalCount = data?.attestationsCount || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
      <>
        {attestations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No attestations found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {attestations.map((attestation: Attestation) => (
                <div key={attestation.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <a
                      href={`https://base-sepolia.easscan.org/attestation/view/${attestation.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View on EAS ↗
                    </a>
                  </div>
                  {attestation.decodedDataJson && (
                    <div className="mt-2 space-y-2">
                      {(() => {
                        try {
                          const decodedData = JSON.parse(attestation.decodedDataJson) as AttestationData[];
                          const formattedData = formatAttestationData(decodedData);
                          const displayOrder = [
                            'userAddress',
                            'verifiedName',
                            'proofMethod',
                            'eventName',
                            'eventType',
                            'assignedRole',
                            'poapProof',
                            'missionName',
                            'attester',
                            'proofProtocol'
                          ];

                          return displayOrder.map(key => {
                            if (key === 'timestamp') return null;
                            if (!formattedData[key as keyof typeof formattedData] && key !== 'poapProof') return null;

                            let displayValue = formattedData[key as keyof typeof formattedData];
                            if (key === 'attester') {
                              displayValue = 'mission-enrollment.base.eth';
                            }
                            if (key === 'poapProof') {
                              displayValue = 'POAP';
                            }

                            return (
                              <div key={key} className="bg-red-50 hover:bg-red-100 p-2 rounded flex justify-between items-center transition-colors duration-200">
                                <span className="font-semibold text-gray-900">{getFieldLabel(key)}</span>
                                <span className="text-gray-800 break-all">{displayValue}</span>
                              </div>
                            );
                          }).filter(Boolean);
                        } catch (e) {
                          console.error('[RecentAttestationsView] JSON Parse Error:', e);
                          return <p className="text-red-500">Invalid JSON data</p>;
                        }
                      })()}
                    </div>
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
      </>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {content()}
      </ErrorBoundary>
    </div>
  );
}
