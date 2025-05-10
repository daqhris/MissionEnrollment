import { ethers } from "hardhat";
import "dotenv/config";

async function grantRole() {
  const args = process.argv.slice(2);
  const addressArgIndex = args.findIndex(arg => arg === '--address');
  
  let addressToGrant: string;
  
  if (addressArgIndex !== -1 && args.length > addressArgIndex + 1) {
    addressToGrant = args[addressArgIndex + 1];
  } else {
    addressToGrant = process.env.ATTESTATION_CREATOR_ADDRESS || '';
    
    if (!addressToGrant) {
      throw new Error("No address provided. Use --address <address> or set ATTESTATION_CREATOR_ADDRESS environment variable");
    }
  }
  
  const networkArgIndex = args.findIndex(arg => arg.startsWith('--network='));
  const network = networkArgIndex !== -1 
    ? args[networkArgIndex].split('=')[1] 
    : 'base-sepolia';
  
  console.log(`Network: ${network}`);
  console.log(`Granting attestation creator role to: ${addressToGrant}`);
  
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer account:", deployer.address);
  
  const contractAddress = process.env.ATTESTATION_SERVICE_ADDRESS;
  if (!contractAddress) {
    throw new Error("ATTESTATION_SERVICE_ADDRESS environment variable not set");
  }
  
  console.log(`Using contract at address: ${contractAddress}`);
  
  const AttestationService = await ethers.getContractFactory("AttestationService");
  const attestationService = AttestationService.attach(contractAddress);
  
  console.log(`Granting ATTESTATION_CREATOR_ROLE to ${addressToGrant}...`);
  const tx = await attestationService.grantAttestationCreatorRole(addressToGrant);
  await tx.wait();
  
  console.log("Role granted successfully!");
  
  const hasRole = await attestationService.isApprovedAttestationCreator(addressToGrant);
  console.log(`Address ${addressToGrant} has ATTESTATION_CREATOR_ROLE: ${hasRole}`);
}

grantRole()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
