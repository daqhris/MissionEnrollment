import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import type { Attestation } from '../types/attestation';
import { AttestationCard } from './AttestationCard';
import { Spinner } from './assets/Spinner';
import tw from 'tailwind-styled-components';
import { GET_RECENT_ATTESTATIONS } from '../graphql/queries';

interface AttestationWithDecodedData {
  decodedDataJson: string;
  time: string;
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string | null;
  expirationTime: string | null;
  data?: string;
}

interface DecodedData {
  name: string;
  type: string;
  signature: string;
  value: {
    name: string;
    type: string;
    value: string;
  };
}

type ExtendedAttestation = AttestationWithDecodedData;

interface RecentAttestationsViewProps {
  title: string;
  pageSize?: number;
}

const AttestationList = tw.div`
  w-full
  max-w-3xl
  space-y-6
` as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

const AttestationItem = tw.div`
  bg-gray-800
  bg-opacity-95
  rounded-2xl
  shadow-2xl
  p-6
  backdrop-blur-sm
` as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

const Title = tw.h1`
  text-3xl
  font-extrabold
  mb-6
  text-center
  text-white
  mt-4
` as unknown as React.FC<React.HTMLAttributes<HTMLHeadingElement>>;

const StatementText = tw.p`
  text-xl
  font-semibold
  text-white
  mb-4
  mt-0
` as unknown as React.FC<React.HTMLAttributes<HTMLParagraphElement>>;

const ValidityText = tw.p`
  text-lg
  font-medium
  mb-2
  text-white
` as unknown as React.FC<React.HTMLAttributes<HTMLParagraphElement>>;

const CritiqueText = tw.p`
  text-gray-300
  mb-4
` as unknown as React.FC<React.HTMLAttributes<HTMLParagraphElement>>;

const TimeText = tw.p`
  text-sm
  text-gray-400
` as unknown as React.FC<React.HTMLAttributes<HTMLParagraphElement>>;

const LoadingWrapper = tw.div`
  flex
  justify-center
  items-center
  h-64
` as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

const FilterContainer = tw.div`
  flex
  flex-col
  md:flex-row
  gap-4
  mb-6
  px-4
` as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

const FilterInput = tw.input`
  input
  input-bordered
  w-full
  md:w-auto
` as unknown as React.FC<React.InputHTMLAttributes<HTMLInputElement>>;

const PaginationContainer = tw.div`
  flex
  justify-center
  gap-2
  mt-6
` as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>;

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): React.ReactElement {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { loading, error, data } = useQuery(GET_RECENT_ATTESTATIONS, {
    variables: {
      take: pageSize * 2,
      skip: (currentPage - 1) * pageSize,
      attester: addressFilter || undefined
    },
    skip: !isClient,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error("GraphQL query error:", error);
    }
  });

  const parseDecodedData = (decodedDataJson: string | undefined): Record<string, string> => {
    if (!decodedDataJson) return {};
    try {
      const parsedData: DecodedData[] = JSON.parse(decodedDataJson);
      return parsedData.reduce((acc, item) => {
        if (item?.value?.value) {
          acc[item.name] = item.value.value;
        }
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error("Error parsing decoded data:", error);
      return {};
    }
  };

  // Filter attestations by date if filter is set
  const filteredAttestations = React.useMemo(() => {
    if (!data?.attestations) return [];
    return data.attestations.filter((attestation: ExtendedAttestation) => {
      if (!attestation) return false;
      if (dateFilter) {
        try {
          const attestationDate = new Date(parseInt(attestation.time) * 1000).toISOString().split('T')[0];
          if (attestationDate !== dateFilter) return false;
        } catch (error) {
          console.error("Error parsing attestation date:", error);
          return false;
        }
      }
      return true;
    });
  }, [data?.attestations, dateFilter]);

  const totalPages = Math.ceil(filteredAttestations.length / pageSize);
  const paginatedAttestations = filteredAttestations.slice(0, pageSize);

  if (!isClient) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading attestations: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      ) : (
        <>
          <Title>{title}</Title>

          <FilterContainer>
            <FilterInput
              type="date"
              value={dateFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            <FilterInput
              type="text"
              value={addressFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressFilter(e.target.value)}
              placeholder="Filter by attester address"
            />
          </FilterContainer>

          {paginatedAttestations.length > 0 ? (
            <AttestationList>
              {paginatedAttestations.map((attestation: ExtendedAttestation) => {
                if (!attestation) return null;
                const decodedData = parseDecodedData(attestation.decodedDataJson);
                return (
                  <AttestationItem key={attestation.id}>
                    {decodedData.requestedTextToVerify && (
                      <StatementText>{decodedData.requestedTextToVerify}</StatementText>
                    )}
                    {decodedData.validity && (
                      <ValidityText>
                        Validity: <span className="font-bold capitalize">{decodedData.validity}</span>
                      </ValidityText>
                    )}
                    {decodedData.critique && (
                      <CritiqueText>{decodedData.critique}</CritiqueText>
                    )}
                    <TimeText>
                      Attested on: {new Date(parseInt(attestation.time) * 1000).toLocaleString()}
                    </TimeText>
                    <AttestationCard
                      attestation={{
                        id: attestation.id,
                        attester: attestation.attester,
                        recipient: attestation.recipient,
                        refUID: attestation.refUID,
                        revocable: attestation.revocable,
                        revocationTime: attestation.revocationTime,
                        expirationTime: attestation.expirationTime,
                        data: attestation.data || '',
                      }}
                    />
                  </AttestationItem>
                );
              })}
            </AttestationList>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No attestations found
            </div>
          )}

          {totalPages > 1 && (
            <PaginationContainer>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </PaginationContainer>
          )}
        </>
      )}
    </div>
  );
}
