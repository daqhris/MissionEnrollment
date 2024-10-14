const axios = require('axios');
const NodeCache = require("node-cache");

const POAP_API_KEY = process.env.POAP_API_KEY;

// ETHGlobal Brussels 2024 POAP event IDs
const ETHGLOBAL_BRUSSELS_2024_EVENT_IDS = ["176334", "176328", "176329", "176330", "176331", "176332"];

// POAP contract address on Gnosis Chain
const POAP_CONTRACT_ADDRESS = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

// Mapping of POAP event IDs to their corresponding PNG image URLs
const POAP_IMAGE_URLS = {
  "176334": "https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png",
  "176328": "https://assets.poap.xyz/7d38ca82-4fa6-41f4-b526-cfd1894e168b.png",
  "176329": "https://assets.poap.xyz/ba72648e-b534-4630-80bf-caf648ee9ba9.png",
  "176330": "https://assets.poap.xyz/50e25677-94d0-424e-8bda-5b7acc655516.png",
  "176331": "https://assets.poap.xyz/3c556f78-7722-497b-b9fe-b6c45a7a05e4.png",
  "176332": "https://assets.poap.xyz/9b7601c6-9667-46b9-b5e2-6494726a7793.png"
};

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

/**
 * Verify if a user owns any of the ETHGlobal Brussels 2024 POAPs on Gnosis Chain
 * @param {string} address - The user's Ethereum address
 * @returns {Promise<{owned: boolean, imageUrl: string | null, tokenId: string | null}>} - Object indicating ownership, image URL, and token ID if owned
 */
async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  const cacheKey = `poap_${address}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    console.log(`Using cached result for address ${address}`);
    return cachedResult;
  }

  try {
    const response = await axios.get(`https://api.poap.tech/actions/scan/${address}`, {
      headers: {
        'X-API-Key': POAP_API_KEY
      }
    });

    const poaps = response.data;
    console.log(`Total POAPs fetched for ${address}:`, poaps.length);

    const ethGlobalPOAPs = poaps.filter(poap =>
      ETHGLOBAL_BRUSSELS_2024_EVENT_IDS.includes(poap.event.id.toString()) &&
      poap.chain === 'xdai'
    );

    console.log(`ETHGlobal Brussels 2024 POAPs found for ${address} on Gnosis Chain:`, ethGlobalPOAPs.length);

    if (ethGlobalPOAPs.length > 0) {
      const ownedPOAP = ethGlobalPOAPs[0];
      const result = {
        owned: true,
        imageUrl: POAP_IMAGE_URLS[ownedPOAP.event.id.toString()],
        tokenId: ownedPOAP.tokenId
      };
      console.log(`POAP found for address ${address}. Token ID: ${result.tokenId}, Image URL: ${result.imageUrl}`);
      cache.set(cacheKey, result);
      return result;
    }

    const result = { owned: false, imageUrl: null, tokenId: null };
    cache.set(cacheKey, result);
    console.log(`No ETHGlobal Brussels 2024 POAPs found for address ${address} on Gnosis Chain`);
    return result;
  } catch (error) {
    console.error(`Error verifying POAP ownership for address ${address}:`, error.message);
    return { owned: false, imageUrl: null, tokenId: null };
  }
}

module.exports = {
  verifyETHGlobalBrusselsPOAPOwnership,
};
