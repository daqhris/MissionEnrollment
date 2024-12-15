'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ENROLLMENTS } from '../graphql/queries';
import { ErrorBoundary } from 'react-error-boundary';
import { formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { SCHEMA_UID as SCHEMA_ID } from '../utils/constants';

interface EnrollmentsViewProps {
  title: string;
  pageSize?: number;
}

export function EnrollmentsView({ title, pageSize = 20 }: EnrollmentsViewProps): React.ReactElement {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const { loading, error: queryError, data, fetchMore } = useQuery(GET_ENROLLMENTS, {
    variables: {
      take: pageSize,
      skip: (page - 1) * pageSize,
      schemaId: SCHEMA_ID,
    },
    onError: (error) => {
      console.error('[EnrollmentsView] GraphQL Error:', error);
      setError(error);
    },
  });

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchMore({
      variables: {
        skip: (newPage - 1) * pageSize,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || queryError) {
    const errorMessage = queryError?.message || error?.message || 'An unknown error occurred';
    console.error('[EnrollmentsView] Error fetching attestations:', errorMessage);
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Enrollments</h3>
        <p className="text-gray-600">{errorMessage}</p>
      </div>
    );
  }

  const attestations = data?.attestations || [];
  const totalCount = data?.attestationsCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#957777] mb-4">{title}</h2>
      </div>

      {attestations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No enrollments found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {attestations.map((attestation: any) => {
              const { id, attester, recipient, time, revoked, data } = attestation;
              let decodedData;
              try {
                decodedData = JSON.parse(data);
              } catch (e) {
                console.error('[EnrollmentsView] JSON Parse Error:', e);
                return <p className="text-red-500">Invalid JSON data</p>;
              }

              return (
                <Card
                  key={id}
                  href={`/attestation/${id}`}
                  className="transform transition-all hover:scale-[1.02]"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Attester</p>
                        <p className="text-gray-600 break-all">{attester}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {formatDistanceToNow(new Date(time * 1000), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">Recipient</p>
                      <p className="text-gray-600 break-all">{recipient}</p>
                    </div>

                    {revoked && (
                      <div className="mb-3">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Revoked
                        </span>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold mb-2">Enrollment Data</h4>
                      <div className="space-y-2">
                        {Object.entries(decodedData).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium">{key}:</span>{' '}
                            <span className="text-gray-600">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
