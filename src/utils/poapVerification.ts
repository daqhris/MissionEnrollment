import axios from 'axios';
import NodeCache from 'node-cache';

const POAP_API_KEY = process.env.POAP_API_KEY;

// ETHGlobal Brussels 2024 POAP event IDs
const ETHGLOBAL_BRUSSELS_2024_EVENT_IDS: string[] = ["176334", "176328", "176329", "176330", "176331", "176332"];

// Mapping of POAP event IDs to their corresponding PNG image URLs
const POAP_IMAGE_URLS: Record<string, string> = {
  "176334": "https://assets.poap.xyz/ethglobal-brussels-2024-attendee-2024-logo-1708099190982.png",
  "176328": "https://assets.poap.xyz/ethglobal-brussels-2024-finalist-2024-logo-1708099190982.png",
  "176329": "https://assets.poap.xyz/ethglobal-brussels-2024-winner-2024-logo-1708099190982.png",
  "176330": "https://assets.poap.xyz/ethglobal-brussels-2024-sponsor-2024-logo-1708099190982.png",
  "176331": "https://assets.poap.xyz/ethglobal-brussels-2024-speaker-2024-logo-1708099190982.png",
  "176332": "https://assets.poap.xyz/ethglobal-brussels-2024-mentor-2024-logo-1708099190982.png"
};

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

interface POAPEvent {
  event: {
    id: string;
    name: string;
  };
  tokenId: string;
  chain: string;
}

interface VerificationResult {
  owned: boolean;
  imageUrl: string | null;
  tokenId: string | null;
}

/**
 * Verify if a user owns any of the ETHGlobal Brussels 2024 POAPs on Gnosis Chain
 * @param address - The user's Ethereum address
 * @returns Object indicating ownership, image URL, and token ID if owned
 */
async function verifyETHGlobalBrusselsPOAPOwnership(address: string): Promise<VerificationResult> {
  const cacheKey = `poap_${address}`;
  const cachedResult = cache.get<VerificationResult>(cacheKey);

  if (cachedResult) {
    console.log(`Using cached result for address ${address}`);
    return cachedResult;
  }

  try {
    const response = await axios.get<POAPEvent[]>(`https://api.poap.tech/actions/scan/${address}`, {
      headers: {
        'X-API-Key': POAP_API_KEY
      }
    });

    const poaps = response.data;
    console.log(`Total POAPs fetched for ${address}:`, poaps.length);

    const ethGlobalPOAPs = poaps.filter(poap =>
      ETHGLOBAL_BRUSSELS_2024_EVENT_IDS.includes(poap.event.id) &&
      poap.chain === 'xdai'
    );

    console.log(`ETHGlobal Brussels 2024 POAPs found for ${address} on Gnosis Chain:`, ethGlobalPOAPs.length);

    if (ethGlobalPOAPs.length > 0) {
      const ownedPOAP = ethGlobalPOAPs[0];
      if (ownedPOAP) {
        const result: VerificationResult = {
          owned: true,
          imageUrl: POAP_IMAGE_URLS[ownedPOAP.event.id] || null,
          tokenId: ownedPOAP.tokenId
        };
        console.log(`POAP found for address ${address}. Token ID: ${result.tokenId}, Image URL: ${result.imageUrl}`);
        cache.set(cacheKey, result);
        return result;
      }
    }

    const result: VerificationResult = { owned: false, imageUrl: null, tokenId: null };
    cache.set(cacheKey, result);
    console.log(`No ETHGlobal Brussels 2024 POAPs found for address ${address} on Gnosis Chain`);
    return result;
  } catch (error) {
    console.error(`Error verifying POAP ownership for address ${address}:`, (error as Error).message);
    return { owned: false, imageUrl: null, tokenId: null };
  }
}

export {
  verifyETHGlobalBrusselsPOAPOwnership,
};
