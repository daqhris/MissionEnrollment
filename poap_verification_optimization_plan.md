# POAP Verification Optimization Plan

## Current Implementation Analysis
The current implementation in `poapVerification.js` uses the POAP API to verify ownership of ETHGlobal Brussels 2024 POAPs. It checks each POAP event ID sequentially, which may lead to performance issues and potential browser crashes when dealing with multiple POAPs.

## Proposed Optimizations

### 1. Batch Requests using Alchemy NFT API
Replace individual POAP API calls with a single batch request using the Alchemy NFT API. This will significantly reduce the number of API calls and improve performance.

```javascript
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  const nfts = await alchemy.nft.getNftsForOwner(address);
  const ethGlobalPOAPs = nfts.ownedNfts.filter(nft =>
    ETHGLOBAL_BRUSSELS_2024_EVENT_IDS.includes(nft.tokenId) &&
    nft.contract.address === "POAP_CONTRACT_ADDRESS"
  );

  return {
    owned: ethGlobalPOAPs.length > 0,
    imageUrl: ethGlobalPOAPs.length > 0 ? POAP_IMAGE_URLS[ethGlobalPOAPs[0].tokenId] : null
  };
}
```

### 2. Implement Caching
Introduce a caching mechanism to store verification results for a short period, reducing redundant API calls.

```javascript
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

async function verifyETHGlobalBrusselsPOAPOwnership(address) {
  const cacheKey = `poap_${address}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  // Perform verification using Alchemy API
  const result = await performAlchemyVerification(address);

  cache.set(cacheKey, result);
  return result;
}
```

### 3. Optimize Frontend Rendering
Implement lazy loading and virtual scrolling for displaying multiple POAPs to prevent browser crashes.

```jsx
import { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

function POAPList({ address }) {
  const [poaps, setPOAPs] = useState([]);

  useEffect(() => {
    async function fetchPOAPs() {
      const result = await verifyETHGlobalBrusselsPOAPOwnership(address);
      setPOAPs(result.owned ? [result] : []);
    }
    fetchPOAPs();
  }, [address]);

  const Row = ({ index, style }) => (
    <div style={style}>
      <img src={poaps[index].imageUrl} alt={`POAP ${index}`} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={poaps.length}
      itemSize={100}
      width={300}
    >
      {Row}
    </List>
  );
}
```

## Implementation Steps

1. Update dependencies in `package.json`:
   - Add Alchemy SDK: `yarn add alchemy-sdk`
   - Add caching library: `yarn add node-cache`
   - Add virtual list component: `yarn add react-window`

2. Modify `poapVerification.js` to use Alchemy NFT API and implement caching.

3. Update frontend components to use optimized rendering techniques.

4. Test the new implementation with various wallet addresses to ensure efficiency and prevent browser crashes.

5. Update the `.env.local` file to include the Alchemy API key:
   ```
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   ```

6. Update the README.md file with new setup instructions and dependencies.

By implementing these optimizations, we can significantly improve the performance of POAP ownership verification and prevent browser crashes while efficiently displaying multiple POAPs.
