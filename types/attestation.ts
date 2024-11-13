export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string | null;
  expirationTime: string | null;
  time: string;  // Add time field from GraphQL response
  data: string;
  decodedDataJson?: string;  // Optional field for decoded data
}
