import axios, { AxiosError } from 'axios';

export interface POAPEvent {
  event: {
    id: string;
    name: string;
    image_url: string;
    start_date: string;
    description?: string;
  };
  token_id: string;
  metadata?: {
    image?: string;
  };
}

interface POAPResponse {
  poaps: POAPEvent[];
  hasEthGlobalBrussels: boolean;
}

/**
 * Fetches POAPs for a given wallet address and checks for ETHGlobal Brussels 2024 POAP
 * @param userAddress - The wallet address to fetch POAPs for
 * @returns Object containing POAPs and whether ETHGlobal Brussels POAP was found
 * @throws Error if API key is missing or API request fails
 */
export async function fetchAndVerifyPOAPs(userAddress: string): Promise<POAPResponse> {
  if (!userAddress) {
    throw new Error('Wallet address is required');
  }

  const poapApiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
  if (!poapApiKey) {
    throw new Error('POAP API key is not available. Please check your environment variables.');
  }

  try {
    // Use the proxy endpoint to fetch POAPs
    const response = await axios.get(`/poap-api/actions/scan/${userAddress}`, {
      params: {
        chain: 'gnosis',
        limit: 100
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('POAP API error: Invalid response format');
    }

    const fetchedPoaps: POAPEvent[] = await Promise.all(
      response.data
        .filter((poap: POAPEvent) => poap.event && poap.event.id)
        .map(async (poap: POAPEvent) => {
          let metadata = null;
          if (poap.event.image_url?.startsWith('ipfs://')) {
            const ipfsHash = poap.event.image_url.replace('ipfs://', '');
            const ipfsUrl = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/ipfs/${ipfsHash}`;
            try {
              const metadataResponse = await axios.get(ipfsUrl, { timeout: 5000 });
              metadata = metadataResponse.data;
            } catch (error) {
              console.warn(`Error fetching IPFS metadata for POAP ${poap.token_id}:`, error);
              metadata = { image: poap.event.image_url };
            }
          } else {
            metadata = { image: poap.event.image_url };
          }

          return {
            event: {
              id: poap.event.id,
              name: poap.event.name || 'Unknown Event',
              image_url: poap.event.image_url || '',
              start_date: poap.event.start_date || '',
              description: poap.event.description,
            },
            token_id: poap.token_id,
            metadata,
          };
        })
    );

    // Check for ETHGlobal Brussels 2024 POAP
    const hasEthGlobalBrussels = fetchedPoaps.some(
      (poap) => poap.event.name.toLowerCase() === 'ethglobal brussels 2024'
    );

    return {
      poaps: fetchedPoaps,
      hasEthGlobalBrussels,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`POAP API error: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    throw error;
  }
}
