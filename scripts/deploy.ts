import { ethers } from "hardhat";
import { Log } from "ethers";

async function main() {
  // Base Sepolia EAS Contract addresses
  const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";
  const SCHEMA_REGISTRY_ADDRESS = "0x4200000000000000000000000000000000000020";

  console.log("Deploying AttestationService...");
  const AttestationService = await ethers.getContractFactory("AttestationService");
  const attestationService = await AttestationService.deploy(
    EAS_CONTRACT_ADDRESS,
    SCHEMA_REGISTRY_ADDRESS
  );

  await attestationService.waitForDeployment();
  const address = await attestationService.getAddress();
  console.log("AttestationService deployed to:", address);

  // Initialize the contract
  console.log("Initializing contract...");
  const initTx = await attestationService.initialize();
  await initTx.wait();
  console.log("Contract initialized");

  // Create the schema
  console.log("Creating schema...");
  const schemaTx = await attestationService.createMissionEnrollmentSchema();
  const receipt = await schemaTx.wait();

  // Get the schema ID from the event
  const schemaCreatedEvent = receipt.logs.find(
    (log: Log) => log.topics[0] === ethers.id("SchemaCreated(bytes32,string,string)")
  );

  // Extract schema ID from the event data (bytes32 from first indexed parameter)
  const schemaId = schemaCreatedEvent ?
    ethers.hexlify(schemaCreatedEvent.topics[1]) :
    undefined;
  console.log("Schema created with ID:", schemaId);

  // Update the EnrollmentAttestation component with the contract address and schema ID
  console.log("\nUpdate your EnrollmentAttestation component with these values:");
  console.log("Contract Address:", address);
  console.log("Schema ID:", schemaId);

  return { attestationService, schemaId };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });