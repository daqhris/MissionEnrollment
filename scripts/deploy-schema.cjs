const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

async function main() {
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Base Sepolia EAS Contract Address
  const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";
  const SCHEMA_REGISTRY_ADDRESS = "0x4200000000000000000000000000000000000020";

  // Deploy AttestationService as upgradeable
  const AttestationService = await ethers.getContractFactory("AttestationService");
  console.log("Deploying AttestationService...");
  const attestationService = await upgrades.deployProxy(
    AttestationService,
    [EAS_CONTRACT_ADDRESS, SCHEMA_REGISTRY_ADDRESS],
    { initializer: 'initialize' }
  );
  await attestationService.waitForDeployment();

  const contractAddress = await attestationService.getAddress();
  console.log("AttestationService deployed to:", contractAddress);

  // Schema definition matching frontend requirements
  const schemaString = "address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol";
  console.log("Schema string:", schemaString);

  // Create schema
  console.log("Creating Mission Enrollment schema...");
  const tx = await attestationService.createMissionEnrollmentSchema();
  const receipt = await tx.wait();

  // Get schema UID from event logs
  const schemaCreatedEvent = receipt.logs.find(
    log => log.topics[0] === ethers.id("SchemaCreated(bytes32)")
  );

  if (!schemaCreatedEvent) {
    throw new Error("Schema creation event not found in logs");
  }

  const schemaUID = schemaCreatedEvent.topics[1];
  console.log("Schema registered with UID:", schemaUID);

  // Verify on Blockscout
  console.log("Verify contract on Blockscout at:");
  console.log(`https://base-sepolia.blockscout.com/address/${contractAddress}`);

  // Save contract address and schema UID for frontend
  console.log("\nAdd these values to your frontend configuration:");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Schema UID: ${schemaUID}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
