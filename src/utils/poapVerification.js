import { Alchemy, Network } from "alchemy-sdk";
import NodeCache from "node-cache";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const POAP_CONTRACT_ADDRESS = "0x22C1f6050E56d2876009903609a2cC3fEf83B415";

// ETHGlobal Brussels 2024 POAP event IDs
const ETHGLOBAL_BRUSSELS_2024_EVENT_IDS = ["176334", "176328", "176329", "176330", "176331", "176332"];

// Mapping of POAP event IDs to their corresponding PNG image URLs
const POAP_IMAGE_URLS = {
  "176334": "https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png",
  "176328": "https://assets.poap.xyz/7d38ca82-4fa6-41f4-b526-cfd1894e168b.png",
  "176329": "https://assets.poap.xyz/ba72648e-b534-4630-80bf-caf648ee9ba9.png",
  "176330": "https://assets.poap.xyz/50e25677-94d0-424e-8bda-5b7acc655516.png",
  "176331": "https://assets.poap.xyz/3c556f78-7722-497b-b9fe-b6c45a7a05e4.png",
  "176332": "https://assets.poap.xyz/9b7601c6-9667-46b9-b5e2-6494726a7793.png"
};

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Function to clear cache (for testing purposes)
function clearCache() {
  cache.flushAll();
}

/**
 * Verify if a user owns any of the ETHGlobal Brussels 2024 POAPs
 * @param {string} address - The user's Ethereum address
 * @returns {Promise<{owned: boolean, imageUrl: string | null}>} - Object indicating ownership and image URL if owned
 */
async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  try {
    const nfts = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [POAP_CONTRACT_ADDRESS],
    });

    const ethGlobalPOAPs = nfts.ownedNfts.filter(nft =>
      ETHGLOBAL_BRUSSELS_2024_EVENT_IDS.includes(nft.tokenId)
    );

    if (ethGlobalPOAPs.length > 0) {
      const result = {
        owned: true,
        imageUrl: POAP_IMAGE_URLS[ethGlobalPOAPs[0].tokenId]
      };
      console.log(`POAP found for address ${address}. Image URL: ${result.imageUrl}`);
      return result;
    }

    console.log(`No ETHGlobal Brussels 2024 POAPs found for address ${address}`);
    return { owned: false, imageUrl: null };
  } catch (error) {
    console.error(`Error verifying POAP ownership for address ${address}:`, error.message);
    if (error.message.includes('API Error')) {
      throw new Error('API Error');
    }
    return { owned: false, imageUrl: null };
  }
}

module.exports = {
  verifyETHGlobalBrusselsPOAPOwnership,
  clearCache,
};
