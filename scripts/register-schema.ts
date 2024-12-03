import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

async function main() {
    if (!process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL) {
        throw new Error("Missing BASE_SEPOLIA_RPC_URL environment variable");
    }
    if (!process.env.DEPLOYER_PRIVATE_KEY) {
        throw new Error("Missing DEPLOYER_PRIVATE_KEY environment variable");
    }

    // Connect to Base Sepolia with the deployer wallet
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    // Initialize SchemaRegistry with the correct address for Base Sepolia
    const schemaRegistryAddress = "0x54f0e66D5A04702F5Df9BAe330295a11bD862c81";
    const schemaRegistry = new SchemaRegistry(schemaRegistryAddress);
    const connectedRegistry = schemaRegistry.connect(wallet);

    // Schema details
    const schema = "address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol";
    const revocable = true;

    try {
        console.log("Registering new schema...");
        console.log("Schema:", schema);
        console.log("Revocable:", revocable);

        // Calculate schema UID before registration
        const schemaUID = SchemaRegistry.getSchemaUID(schema, ethers.ZeroAddress, revocable);
        console.log("Calculated Schema UID:", schemaUID);

        const transaction = await connectedRegistry.register({
            schema,
            revocable,
        });

        console.log("Transaction submitted");
        console.log("Waiting for confirmation...");

        await transaction.wait();
        console.log("Transaction confirmed");

        console.log("\nSchema registration successful!");
        console.log("Schema UID:", schemaUID);
        console.log("View on EAS Explorer:", `https://base-sepolia.easscan.org/schema/view/${schemaUID}`);

        return schemaUID;
    } catch (error) {
        console.error("Error registering schema:", error);
        throw error;
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
