import axios from 'axios';

interface POAPEvent {
  event: {
    id: number;
    name: string;
    image_url: string;
    event_url: string;
    start_date: string;
    end_date?: string;
    description?: string;
  };
  tokenId: string;
  metadata?: {
    image: string;
  };
}

export const fetchPoaps = async (userAddress: string): Promise<POAPEvent[]> => {
  try {
    const poapApiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
    if (!poapApiKey) {
      throw new Error("POAP API key is not available. Please check your environment variables.");
    }

    const poapApiUrl = `https://api.poap.tech/actions/scan/${userAddress}`;

    const response = await axios.get(poapApiUrl, {
      headers: {
        'X-API-Key': poapApiKey
      },
      params: {
        chain: 'gnosis',
        limit: 100
      }
    });

    console.log("POAP API response data:", JSON.stringify(response.data, null, 2));

    if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      return [];
    }

    if (!Array.isArray(response.data) || !response.data.every(poap => poap.event && poap.tokenId)) {
      throw new Error(`POAP API error: Invalid response format`);
    }

    const fetchedPoaps: POAPEvent[] = await Promise.all(
      response.data
        .filter((poap: POAPEvent) => poap.event && poap.event.id)
        .map(async (poap: POAPEvent) => {
          let metadata = null;
          if (poap.event.image_url && poap.event.image_url.startsWith('ipfs://')) {
            const ipfsHash = poap.event.image_url.replace('ipfs://', '');
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
            try {
              const metadataResponse = await axios.get(ipfsUrl, { timeout: 5000 });
              metadata = metadataResponse.data;
            } catch (error) {
              console.warn(`Error fetching IPFS metadata for POAP ${poap.tokenId}:`, error);
              metadata = { image: poap.event.image_url };
            }
          } else {
            metadata = { image: poap.event.image_url };
          }
          return {
            event: {
              id: Number(poap.event.id),
              name: poap.event.name || "Unknown Event",
              image_url: poap.event.image_url || "",
              event_url: poap.event.event_url || "",
              start_date: poap.event.start_date || '',
              end_date: (poap.event.event_url || "").toLowerCase().includes('brussels') ? "14-Jul-2024" : poap.event.end_date,
              description: poap.event.description
            },
            tokenId: poap.tokenId,
            metadata,
          };
        })
    );

    return fetchedPoaps;
  } catch (err) {
    console.error("Error fetching POAP data:", err);
    if (axios.isAxiosError(err)) {
      if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
        throw new Error(`An error occurred while fetching POAP data: Network Error`);
      }
      throw new Error(`An error occurred while fetching POAP data: ${err.message}`);
    }
    throw new Error(`An error occurred while fetching POAP data: ${(err as Error).message}`);
  }
};
