import React, { useEffect, useState, ChangeEvent } from 'react';
import type { Attestation } from '../types/attestation';
import { AttestationCard } from './AttestationCard';
import { Spinner } from './assets/Spinner';
import tw from 'tailwind-styled-components';

interface AttestationWithDecodedData {
  decodedDataJson: string;
  time: string;
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string;
  expirationTime: string;
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
`;

const AttestationItem = tw.div`
  bg-gray-800
  bg-opacity-95
  rounded-2xl
  shadow-2xl
  p-6
  backdrop-blur-sm
`;

const Title = tw.h1`
  text-3xl
  font-extrabold
  mb-6
  text-center
  text-white
  mt-4
`;

const StatementText = tw.p`
  text-xl
  font-semibold
  text-white
  mb-4
  mt-0
`;

const ValidityText = tw.p`
  text-lg
  font-medium
  mb-2
  text-white
`;

const CritiqueText = tw.p`
  text-gray-300
  mb-4
`;

const TimeText = tw.p`
  text-sm
  text-gray-400
`;

const LoadingWrapper = tw.div`
  flex
  justify-center
  items-center
  h-64
`;

const FilterContainer = tw.div`
  flex
  flex-col
  md:flex-row
  gap-4
  mb-6
  px-4
`;

const FilterInput = tw.input`
  input
  input-bordered
  w-full
  md:w-auto
`;

const PaginationContainer = tw.div`
  flex
  justify-center
  gap-2
  mt-6
`;

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): JSX.Element {
  const [attestations, setAttestations] = useState<ExtendedAttestation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");

  const parseDecodedData = (decodedDataJson: string): Record<string, string> => {
    try {
      const parsedData: DecodedData[] = JSON.parse(decodedDataJson);
      return parsedData.reduce((acc, item) => {
        acc[item.name] = item.value.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error("Error parsing decoded data:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAttestations = async (): Promise<void> => {
      try {
        const response = await fetch("https://sepolia.easscan.org/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetAttestations($attester: String, $take: Int!) {
                attestations(
                  where: {
                    schemaId: {
                      equals: "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd"
                    },
                    attester: {
                      equals: $attester
                    }
                  }
                  orderBy: [{ time: desc }],
                  take: $take
                ) {
                  attester
                  decodedDataJson
                  id
                  time
                }
              }
            `,
            variables: {
              attester: addressFilter || "0x0fB2FA8306F661E31C7BFE76a5fF3A3F85a9f9A2",
              take: pageSize * 2 // Fetch extra for pagination
            }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attestations");
        }

        const data = await response.json();
        setAttestations(
          data.data.attestations.map((attestation: AttestationWithDecodedData) => ({
            ...attestation,
            recipient: "",
            refUID: "",
            revocable: false,
            revocationTime: "",
            expirationTime: "",
          })),
        );
      } catch (error) {
        console.error("Error fetching attestations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttestations();
  }, [addressFilter, pageSize]);

  // Filter and paginate attestations
  const filteredAttestations = attestations.filter((attestation: ExtendedAttestation) => {
    if (dateFilter) {
      const attestationDate = new Date(parseInt(attestation.time) * 1000).toISOString().split('T')[0];
      if (attestationDate !== dateFilter) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredAttestations.length / pageSize);
  const paginatedAttestations = filteredAttestations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {isLoading ? (
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
              placeholder="Filter by address"
            />
          </FilterContainer>

          <AttestationList>
            {paginatedAttestations.map((attestation: ExtendedAttestation) => {
              const decodedData = parseDecodedData(attestation.decodedDataJson);
              return (
                <AttestationItem key={attestation.id}>
                  <StatementText>{decodedData.requestedTextToVerify}</StatementText>
                  <ValidityText>
                    Validity: <span className="font-bold capitalize">{decodedData.validity}</span>
                  </ValidityText>
                  <CritiqueText>{decodedData.critique}</CritiqueText>
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
                      data: attestation.data,
                    }}
                  />
                </AttestationItem>
              );
            })}
          </AttestationList>

          {totalPages > 1 && (
            <PaginationContainer>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </PaginationContainer>
          )}
        </>
      )}
    </>
  );
}
