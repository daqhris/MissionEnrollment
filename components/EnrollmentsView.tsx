'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ENROLLMENTS } from '../graphql/queries';
import { Spinner } from './assets/Spinner';
import { Attestation, AttestationData } from '../types/attestation';
import { ErrorBoundary } from 'react-error-boundary';
import { formatDistanceToNow } from 'date-fns';
import { SCHEMA_UID as SCHEMA_ID } from '../utils/constants';
import { formatAttestationData, getFieldLabel } from '../utils/formatting';

interface EnrollmentsViewProps {
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

export function EnrollmentsView({ title, pageSize = 20 }: EnrollmentsViewProps): React.ReactElement {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const { loading, error: queryError, data, fetchMore } = useQuery(GET_ENROLLMENTS, {
    variables: {
      take: pageSize,
      skip: (page - 1) * pageSize,
      schemaId: SCHEMA_ID
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('[EnrollmentsView] GraphQL Error:', error);
      setError(error);
    }
  });

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchMore({
      variables: {
        skip: (newPage - 1) * pageSize,
      },
    });
  };

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
      console.error('[EnrollmentsView] Error fetching attestations:', errorMessage);
      return (
        <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200 alert alert-error">
          <h2 className="text-xl font-bold mb-2">Error Loading Enrollments</h2>
          <p>Error loading enrollments for schema {SCHEMA_ID}</p>
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
            <p className="text-gray-500">No enrollments found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {attestations.map((attestation: Attestation) => (
                <div key={attestation.id} className="p-8 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-red-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-600 text-sm">
                      {formatDistanceToNow(new Date(attestation.time * 1000), { addSuffix: true })}
                    </div>
                    <a
                      href={`https://base-sepolia.easscan.org/attestation/view/${attestation.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={(e) => e.stopPropagation()}
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
                            'userAddress',      // Address: 0xb5ee...
                            'verifiedName',     // Name: daqhris.base.eth
                            'proofMethod',      // Proof: Basename
                            'eventName',        // Event: ETHGlobal Brussels 2024
                            'eventType',        // Type: International Hackathon
                            'assignedRole',     // Role: Hacker
                            'missionName',      // Mission: Zinneke Rescue Mission
                            'attester',         // Attester: mission-enrollment.base.eth
                            'proofProtocol'     // Proof: EAS
                          ];

                          return displayOrder.map((key, index) => {
                            const value = formattedData[key as keyof typeof formattedData];
                            if (value === undefined || value === null) return null;

                            let displayValue = value;
                            let label = getFieldLabel(key);

                            // Custom display formatting
                            if (key === 'proofProtocol') {
                              label = 'Proof';
                              displayValue = 'EAS';
                            } else if (key === 'proofMethod') {
                              label = 'Proof';
                              displayValue = 'Basename';
                            } else if (key === 'attester') {
                              displayValue = 'mission-enrollment.base.eth';
                            } else if (key === 'userAddress' || key === 'attester') {
                              displayValue = typeof displayValue === 'string' ?
                                `${displayValue.slice(0, 6)}...${displayValue.slice(-4)}` :
                                displayValue;
                            }

                            return (
                              <div key={`${key}-${index}`} className="bg-red-50 hover:bg-red-100 p-2 rounded flex justify-between items-center transition-colors duration-200">
                                <span className="font-semibold text-gray-900">{label}</span>
                                <span className="text-gray-800 break-all">{displayValue}</span>
                              </div>
                            );
                          }).filter(Boolean);
                        } catch (e) {
                          console.error('[EnrollmentsView] JSON Parse Error:', e);
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
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
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
      <h1 className="text-3xl font-bold mb-8 text-center text-[#957777]">{title}</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {content()}
      </ErrorBoundary>
    </div>
  );
}
