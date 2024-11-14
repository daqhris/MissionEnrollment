import { gql } from "@apollo/client";

export const GET_RECENT_ATTESTATIONS = gql`
  query GetRecentAttestations($take: Int!, $skip: Int) {
    attestations(
      take: $take
      skip: $skip
      orderBy: { time: desc }
    ) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      time
      decodedDataJson
    }
  }
`;

export const GET_ATTESTATION_BY_ID = gql`
  query GetAttestationById($id: String!) {
    attestation(id: $id) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      time
      decodedDataJson
    }
  }
`;

export const GET_ATTESTATIONS_BY_RECIPIENT = gql`
  query GetAttestationsByRecipient($address: String!) {
    attestations(where: { recipient: { equals: $address } }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      time
      decodedDataJson
    }
  }
`;
