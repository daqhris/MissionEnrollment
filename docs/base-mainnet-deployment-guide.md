# Base Mainnet Deployment Guide

This document provides detailed instructions for deploying the Mission Enrollment smart contracts to Base mainnet and setting up the necessary EAS schemas.

## Prerequisites

1. A wallet with Base ETH for gas fees (daqhris.base.eth or mission-enrollment.base.eth)
2. Private key for the deployment wallet, set as an environment variable (`DEPLOYER_PRIVATE_KEY`)
3. Access to a Base mainnet RPC URL, set as an environment variable (`NEXT_PUBLIC_BASE_MAINNET_RPC_URL`)
4. OnchainKit API key, set as an environment variable (`NEXT_PUBLIC_ONCHAINKIT_API_KEY`)
5. WalletConnect Project ID, set as an environment variable (`NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`)
6. POAP API key, set as an environment variable (`NEXT_PUBLIC_POAP_API_KEY`)

## Deployment Cost Estimates

| Operation | Estimated Cost (ETH) | Estimated Cost (EUR) |
|-----------|----------------------|----------------------|
| Contract Deployment | ~0.35 ETH | ~€700 |
| Schema Creation | ~0.05 ETH | ~€100 |
| Attestation Creation (per attestation) | ~0.02 ETH | ~€40 |

These estimates are based on current gas prices and ETH value. Actual costs may vary.

## Deployment Steps

### 1. Deploy the AttestationService Contract

```bash
# Set the network flag to deploy to Base mainnet
npx hardhat run scripts/deploy.ts --network base-mainnet
```

This script will:
- Deploy the AttestationService contract to Base mainnet
- Initialize the contract with the Base mainnet EAS contract and schema registry addresses
- Create the Mission Enrollment schema on Base mainnet
- Output the deployed contract address and schema ID

### 2. Verify the Contract on Basescan

```bash
npx hardhat verify --network base-mainnet DEPLOYED_CONTRACT_ADDRESS
```

### 3. Grant Attestation Creator Role

After deployment, you need to grant the attestation creator role to the necessary addresses:

```bash
# Replace ADDRESS_TO_GRANT with the address that should be able to create attestations
npx hardhat run scripts/grantAttestationCreatorRole.ts --network base-mainnet --address ADDRESS_TO_GRANT
```

## EAS Schema Creation Details

The EAS schema for Mission Enrollment attestations has the following structure:

```
address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol
```

This schema is created automatically during the deployment process. If you need to create it manually:

1. Visit the [EAS Schema Registry](https://base.easscan.org/schema/create)
2. Connect your wallet (daqhris.base.eth or mission-enrollment.base.eth)
3. Enter the schema encoding string shown above
4. Set the schema to be revocable
5. Submit the transaction and save the schema UID

## Integration with Frontend

After deployment, update the following environment variables in your frontend:

```
NEXT_PUBLIC_ATTESTATION_SERVICE_ADDRESS=<deployed-contract-address>
NEXT_PUBLIC_SCHEMA_UID=<schema-uid-from-deployment>
```

### Updating the Network Configuration

The application has been updated to support both Base Sepolia (testnet) and Base mainnet. Users can select their preferred network for attestations through the NetworkSelector component.

To ensure the frontend correctly uses the deployed contracts:

1. Update the `ATTESTATION_SERVICE_ADDRESS` in `utils/constants.ts` with your newly deployed contract address
2. Update the `SCHEMA_UID` in `utils/constants.ts` with the schema UID from your deployment

## Transaction Verification

To verify your transactions on Base mainnet:

- Contract deployment: https://basescan.org/address/<deployed-contract-address>
- Schema creation: https://base.easscan.org/schema/<schema-uid>
- Attestations: https://base.easscan.org/attestation/<attestation-id>

## Troubleshooting

### Common Deployment Issues

1. **Insufficient Funds**: Ensure your deployment wallet has enough Base ETH to cover the deployment costs.
   
2. **Gas Price Spikes**: If gas prices are unusually high, consider waiting for a period of lower network activity.

3. **Contract Verification Failures**: If contract verification fails, ensure you're using the exact same compiler settings as in the hardhat.config.cjs file.

### Common Frontend Integration Issues

1. **Network Switching Issues**: If users experience problems switching networks, ensure they have the Base mainnet configured in their wallet.

2. **Attestation Creation Failures**: Check that the wallet has been granted the attestation creator role and has sufficient funds for gas.

## Security Considerations

1. **Private Key Management**: Never expose your deployment private key. Use environment variables and ensure they are not committed to the repository.

2. **Access Control**: Only grant the attestation creator role to trusted addresses.

3. **Contract Upgrades**: The AttestationService contract uses the UUPS upgradeable pattern. Any upgrades should be thoroughly tested before deployment.

## Monitoring and Maintenance

After deployment, regularly monitor:

1. **Contract Activity**: Check for any unexpected attestations or schema changes.

2. **Gas Costs**: Monitor gas costs for attestation creation to ensure they remain within expected ranges.

3. **User Feedback**: Collect feedback from users about the attestation process and network selection experience.

## Conclusion

Following this guide will help you successfully deploy the Mission Enrollment contracts to Base mainnet and integrate them with your frontend. Remember to test thoroughly on Base Sepolia before proceeding with mainnet deployment.
