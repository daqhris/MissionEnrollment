import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

async function main() {
    if (!process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL) {
        throw new Error("Missing BASE_SEPOLIA_RPC_URL environment variable");
    }

    // Connect to Base Sepolia
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL);

    // Initialize SchemaRegistry
    const schemaRegistryAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Base Sepolia Schema Registry
    const schemaRegistry = new SchemaRegistry(schemaRegistryAddress);
    schemaRegistry.connect(provider);

    // Schema details
    const schema = "address userAddress,string verifiedName,bool poapVerified,uint256 timestamp";

    try {
        // Use the known schema UID for Base Sepolia
        const schemaUID = "0x46a1e77e9f1d74c8c60c8d8bd8129947b3c5f4d3e6e9497ae2e4701dd8e2c401";

        // Verify the schema exists
        const schemaRecord = await schemaRegistry.getSchema(schemaUID);
        console.log("\nSchema details:");
        console.log("UID:", schemaUID);
        console.log("Schema:", schemaRecord.schema);
        console.log("Resolver:", schemaRecord.resolver);
        console.log("Revocable:", schemaRecord.revocable);

        if (schemaRecord.schema !== schema) {
            console.warn("\nWarning: Schema format mismatch");
            console.warn("Expected:", schema);
            console.warn("Found:", schemaRecord.schema);
        } else {
            console.log("\nSchema format matches our requirements");
        }

        return schemaUID;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
