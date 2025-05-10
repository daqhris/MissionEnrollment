import { SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED } from '../../../utils/constants';
import { getClient } from '../../../apollo-client';
import { GET_ENROLLMENTS } from '../../../graphql/queries';

export async function generateStaticParams() {
  try {
    const { data } = await getClient().query({
      query: GET_ENROLLMENTS,
      variables: {
        take: 100, // Pre-generate paths for the 100 most recent attestations
        skip: 0,
        schemaIds: [SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED]
      },
    });

    return data.attestations.map((attestation: { id: string }) => ({
      id: attestation.id,
    }));
  } catch (error) {
    console.error('Error generating static params for attestation pages:', error);
    return [];
  }
}
