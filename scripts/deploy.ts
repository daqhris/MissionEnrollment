import { ethers } from "hardhat";
import { AttestationService } from "../typechain-types";
import "dotenv/config";

async function deployAndInitialize(networkId: string = 'base-sepolia'): Promise<{ contract: AttestationService; schemaId: string }> {
  // Network-specific EAS Contract addresses
  const EAS_CONTRACT_ADDRESSES: Record<string, string> = {
    'base-sepolia': "0x4200000000000000000000000000000000000021",
    'base-mainnet': "0x4200000000000000000000000000000000000021"
  };
  
  // Network-specific Schema Registry addresses
  const SCHEMA_REGISTRY_ADDRESSES: Record<string, string> = {
    'base-sepolia': "0x54f0e66D5A04702F5Df9BAe330295a11bD862c81",
    'base-mainnet': "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E" // Base mainnet schema registry
  };
  
  const EAS_CONTRACT_ADDRESS = EAS_CONTRACT_ADDRESSES[networkId] || EAS_CONTRACT_ADDRESSES['base-sepolia'];
  const SCHEMA_REGISTRY_ADDRESS = SCHEMA_REGISTRY_ADDRESSES[networkId] || SCHEMA_REGISTRY_ADDRESSES['base-sepolia'];
  
  console.log(`Deploying to ${networkId}...`);
  console.log(`Using EAS Contract: ${EAS_CONTRACT_ADDRESS}`);
  console.log(`Using Schema Registry: ${SCHEMA_REGISTRY_ADDRESS}`);

  console.log("Deploying AttestationService...");
  const AttestationService = await ethers.getContractFactory("AttestationService");

  const attestationService = await AttestationService.deploy();
  await attestationService.waitForDeployment();
  const address = await attestationService.getAddress();
  console.log("AttestationService deployed to:", address);

  // Initialize the contract
  console.log("Initializing contract...");
  const initTx = await attestationService.initialize(EAS_CONTRACT_ADDRESS, SCHEMA_REGISTRY_ADDRESS);
  const initReceipt = await initTx.wait();
  console.log("Contract initialized");

  // Create the schema immediately after initialization
  console.log("Creating Mission Enrollment schema...");
  const schemaTx = await attestationService.createMissionEnrollmentSchema();
  const receipt = await schemaTx.wait();

  // Verify SchemaCreated event was emitted
  const schemaCreatedEvent = receipt.logs.find(
    (log) => {
      try {
        const parsed = attestationService.interface.parseLog(log);
        return parsed?.name === "SchemaCreated";
      } catch {
        return false;
      }
    }
  );

  if (!schemaCreatedEvent) {
    throw new Error("SchemaCreated event not found in transaction receipt");
  }

  // Verify schema was set
  const schemaId = await attestationService.getMissionEnrollmentSchema();
  if (schemaId === ethers.ZeroHash) {
    throw new Error("Schema creation failed - _missionEnrollmentSchema is zero");
  }

  console.log("Schema created with ID:", schemaId);
  console.log("SchemaCreated event found in logs");

  // Log deployment information
  console.log("\nDeployment Information:");
  console.log("Contract Address:", address);
  console.log("Schema ID:", schemaId);
  console.log("EAS Contract:", EAS_CONTRACT_ADDRESS);
  console.log("Schema Registry:", SCHEMA_REGISTRY_ADDRESS);

  return { contract: attestationService, schemaId };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const networkArg = process.argv.find(arg => arg.startsWith('--network='));
const network = networkArg ? networkArg.split('=')[1] : 'base-sepolia';

deployAndInitialize(network)
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
