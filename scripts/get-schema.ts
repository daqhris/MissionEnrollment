```typescript
import { ethers } from "ethers";
import { EAS_CONTRACT_ADDRESS } from "../utils/constants";

const ATTESTATION_SERVICE_ABI = [
  "function getMissionEnrollmentSchema() external view returns (bytes32)"
];

async function main() {
  // Connect to Base Sepolia
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

  // Create contract instance
  const attestationService = new ethers.Contract(
    EAS_CONTRACT_ADDRESS,
    ATTESTATION_SERVICE_ABI,
    provider
  );

  try {
    // Get schema UID
    const schemaUID = await attestationService.getMissionEnrollmentSchema();
    console.log("Current Schema UID:", schemaUID);
  } catch (error) {
    console.error("Error fetching schema UID:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```
