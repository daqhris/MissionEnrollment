import { gql } from "@apollo/client";

export const GET_ENROLLMENTS = gql`
  query GetEnrollments($take: Int!, $skip: Int, $schemaIds: [String!]) {
    attestations(
      take: $take
      skip: $skip
      where: { schemaId: { in: $schemaIds } }
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
      schemaId
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
