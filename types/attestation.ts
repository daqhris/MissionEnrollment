export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string | null;
  expirationTime: string | null;
  time: number;  // Changed from string to number to match GraphQL response
  data: string;
  decodedDataJson: string;  // Made required as it's always present in responses
}

export interface AttestationData {
  name: string;
  type: string;
  signature: string;
  value: {
    name: string;
    type: string;
    value: string | number | boolean | { type: string; hex: string };
  };
}

export interface AttestationQueryResponse {
  attestations: Attestation[];
  attestationsCount: number;
}
