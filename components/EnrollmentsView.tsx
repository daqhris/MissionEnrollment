'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ENROLLMENTS } from '../graphql/queries';
import { Spinner } from './assets/Spinner';
import { Attestation, AttestationData } from '../types/attestation';
import { ErrorBoundary } from 'react-error-boundary';
import { formatDistanceToNow } from 'date-fns';
import { SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED } from '../utils/constants';
import { formatAttestationData, getFieldLabel } from '../utils/formatting';
import { mockEnrollments, mockAttestationsCount } from '../data/mockEnrollments';

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
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [fallbackData, setFallbackData] = useState<{
    attestations: Attestation[];
    attestationsCount: number;
  } | null>(null);

  const { loading, error: queryError, data, fetchMore } = useQuery(GET_ENROLLMENTS, {
    variables: {
      take: pageSize,
      skip: (page - 1) * pageSize,
      schemaIds: [SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED]
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('[EnrollmentsView] GraphQL Error:', error);
      setError(error);
      
      if (!fallbackData) {
        console.log('[EnrollmentsView] Using fallback data due to API error');
        setFallbackData({
          attestations: mockEnrollments,
          attestationsCount: mockAttestationsCount
        });
        setUseFallbackData(true);
      }
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
    if (loading && !data && !useFallbackData) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if ((queryError || error) && !useFallbackData) {
      const errorMessage = queryError?.message || error?.message || 'An unknown error occurred';
      console.error('[EnrollmentsView] Error fetching attestations:', errorMessage);
      
      const isMaintenanceError = 
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('Network error') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ETIMEDOUT');
      
      return (
        <div className={`p-4 rounded-lg border ${isMaintenanceError ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-500'} alert`}>
          <h2 className="text-xl font-bold mb-2">
            {isMaintenanceError ? 'EAS Explorer Temporarily Unavailable' : 'Error Loading Enrollments'}
          </h2>
          
          {isMaintenanceError ? (
            <>
              <p className="mb-2">The Ethereum Attestation Service Explorer is currently undergoing maintenance or is temporarily unavailable.</p>
              <p className="mb-4">Please check back later to view the latest attestations.</p>
              <div className="flex flex-col md:flex-row gap-2">
                <a 
                  href="https://base-sepolia.easscan.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#957777] text-white rounded hover:bg-[#856666] transition-colors inline-flex items-center justify-center"
                >
                  Check EAS Explorer Status
                </a>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 border border-[#957777] text-[#957777] rounded hover:bg-[#957777]/10 transition-colors inline-flex items-center justify-center"
                >
                  Retry Loading
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Error loading enrollments for schemas</p>
              <pre className="text-sm overflow-auto">{errorMessage}</pre>
            </>
          )}
        </div>
      );
    }

    const effectiveData = useFallbackData ? fallbackData : data;
    const attestations = effectiveData?.attestations || [];
    const totalCount = effectiveData?.attestationsCount || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    
    const fallbackNotice = useFallbackData && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Showing cached data</h3>
            <p className="text-xs mt-1">
              The EAS Explorer is currently unavailable. Showing cached attestation data instead.
              <button 
                onClick={() => window.location.reload()} 
                className="ml-2 underline text-[#957777] hover:text-[#856666]"
              >
                Retry
              </button>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <>
        {fallbackNotice}
        
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
                            'proofProtocol',    // Proof: EAS
                            'verificationSource', // Source: mission-enrollment.base.eth
                            'verificationTimestamp', // Timestamp: ISO date
                            'verificationHash'  // Hash: 0x...
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
