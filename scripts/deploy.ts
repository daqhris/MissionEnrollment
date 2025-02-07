import { ethers } from "hardhat";
import { AttestationService } from "../typechain-types";
import "dotenv/config";

async function deployAndInitialize(): Promise<{ contract: AttestationService; schemaId: string }> {
  const EAS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS || '';
  const SCHEMA_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS || '';

  console.log("Deploying AttestationService...");
  const AttestationService = await ethers.getContractFactory("AttestationService") as unknown as AttestationService;

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
    (log: any) => {
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
deployAndInitialize()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
