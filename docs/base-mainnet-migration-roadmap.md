# Migration Roadmap: Base Sepolia to Base Mainnet

This document outlines the comprehensive plan for migrating the Mission Enrollment application from Base Sepolia testnet to Base mainnet. It includes technical requirements, cost estimates, and a clear division of responsibilities.

## Table of Contents

1. [Current Architecture Overview](#current-architecture-overview)
2. [Migration Requirements](#migration-requirements)
3. [Technical Implementation Plan](#technical-implementation-plan)
4. [Cost Estimates](#cost-estimates)
5. [Responsibilities](#responsibilities)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Checklist](#deployment-checklist)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Rollback Plan](#rollback-plan)

## Current Architecture Overview

The Mission Enrollment application currently operates on Base Sepolia testnet with the following key components:

- **Smart Contracts**: AttestationService.sol deployed on Base Sepolia
- **EAS Integration**: Uses Ethereum Attestation Service (EAS) on Base Sepolia
- **Network Configuration**: 
  - Identity verification on Base mainnet
  - Attestation creation on Base Sepolia
- **Wallet Integration**: Multiple wallet support via RainbowKit
- **POAP Verification**: Verifies ETHGlobal Brussels 2024 POAPs

## Migration Requirements

To migrate from Base Sepolia to Base mainnet, the following requirements must be met:

1. **Smart Contract Deployment**: Deploy AttestationService.sol on Base mainnet
2. **EAS Integration**: Connect to EAS on Base mainnet
3. **Schema Creation**: Create the attestation schema on Base mainnet
4. **Network Configuration**: Update network switching logic to use Base mainnet for attestations
5. **UI Updates**: Modify UI components to reflect Base mainnet usage
6. **Testing**: Comprehensive testing on Base mainnet before public release
7. **Documentation**: Update documentation to reflect Base mainnet deployment

## Technical Implementation Plan

### Phase 1: Development Environment Setup

1. **Update Hardhat Configuration**:
   ```javascript
   // Add Base mainnet configuration to hardhat.config.cjs
   networks: {
     "base-mainnet": {
       url: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
       accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
       chainId: 8453
     },
     "base-sepolia": {
       // existing configuration
     }
   }
   ```

2. **Update Environment Variables**:
   - Add `NEXT_PUBLIC_BASE_MAINNET_RPC_URL`
   - Add `EAS_ADDRESS_BASE_MAINNET`
   - Add `SCHEMA_REGISTRY_ADDRESS_BASE_MAINNET`

### Phase 2: Smart Contract Deployment

1. **Update Deployment Script**:
   ```typescript
   // Modify scripts/deploy.ts to support Base mainnet
   
   // Get network from command line or environment
   const network = process.env.DEPLOY_NETWORK || "base-sepolia";
   
   // Set EAS and Schema Registry addresses based on network
   const EAS_CONTRACT_ADDRESS = network === "base-mainnet" 
     ? "0x4200000000000000000000000000000000000021" // Verify this address for Base mainnet
     : "0x4200000000000000000000000000000000000021"; // Base Sepolia
     
   const SCHEMA_REGISTRY_ADDRESS = network === "base-mainnet"
     ? "0x54f0e66D5A04702F5Df9BAe330295a11bD862c81" // Verify this address for Base mainnet
     : "0x54f0e66D5A04702F5Df9BAe330295a11bD862c81"; // Base Sepolia
   ```

2. **Deploy Contract to Base Mainnet**:
   ```bash
   DEPLOY_NETWORK=base-mainnet npx hardhat run scripts/deploy.ts --network base-mainnet
   ```

3. **Verify Contract on Base Mainnet**:
   ```bash
   npx hardhat verify --network base-mainnet <DEPLOYED_CONTRACT_ADDRESS>
   ```

4. **Update Deployed Contract Address**:
   - Store the deployed contract address in the environment variables
   - Update `contracts/deployedContracts.ts` with the new address

### Phase 3: Frontend Updates

1. **Update Constants**:
   ```typescript
   // Modify utils/constants.ts
   
   // Update EAS contract address to use Base mainnet by default
   export const EAS_CONTRACT_ADDRESS_BASE = '0x4200000000000000000000000000000000000021'; // Verify this address
   export const EAS_CONTRACT_ADDRESS_SEPOLIA = '0x4200000000000000000000000000000000000021';
   export const EAS_CONTRACT_ADDRESS = EAS_CONTRACT_ADDRESS_BASE; // Default to Base mainnet for attestations
   
   // Update network switching logic
   export const isCorrectNetwork = (chainId: number, action: 'verification' | 'attestation'): boolean => {
     return chainId === base.id; // Both verification and attestation on Base mainnet
   };
   
   export const getRequiredNetwork = (action: 'verification' | 'attestation') => {
     return base; // Both verification and attestation on Base mainnet
   };
   ```

2. **Update EnrollmentAttestation Component**:
   ```typescript
   // Modify components/EnrollmentAttestation.tsx
   
   // Update EAS initialization
   const eas = new EAS(EAS_CONTRACT_ADDRESS_BASE); // Use Base mainnet address
   ```

3. **Update Schema UID**:
   ```typescript
   // After creating the schema on Base mainnet, update the SCHEMA_UID in utils/constants.ts
   export const SCHEMA_UID = '0x...'; // New schema UID from Base mainnet
   ```

### Phase 4: Testing and Validation

1. **Local Testing**:
   - Test the application with Base mainnet configuration in a local environment
   - Verify network switching works correctly
   - Verify attestation creation works on Base mainnet

2. **Staging Deployment**:
   - Deploy to a staging environment connected to Base mainnet
   - Test with real wallets and transactions
   - Verify POAP verification and attestation creation

3. **User Acceptance Testing**:
   - Limited release to selected users
   - Gather feedback and fix issues

### Phase 5: Production Deployment

1. **Update Documentation**:
   - Update README.md to reflect Base mainnet deployment
   - Update user guides and documentation

2. **Deploy to Production**:
   - Update environment variables in production
   - Deploy the application to production

3. **Monitoring**:
   - Monitor transactions and user interactions
   - Address any issues that arise

## Cost Estimates

### Smart Contract Deployment

| Operation | Gas Estimate | Base Gas Price (Gwei) | Cost in ETH | Cost in EUR* |
|-----------|--------------|----------------------|-------------|-------------|
| Contract Deployment | ~3,000,000 | 0.1 | ~0.3 ETH | ~€600 |
| Schema Creation | ~500,000 | 0.1 | ~0.05 ETH | ~€100 |
| **Total Deployment** | | | **~0.35 ETH** | **~€700** |

### User Operations

| Operation | Gas Estimate | Base Gas Price (Gwei) | Cost in ETH | Cost in EUR* |
|-----------|--------------|----------------------|-------------|-------------|
| Create Attestation | ~200,000 | 0.1 | ~0.02 ETH | ~€40 |
| Verify Attestation | ~50,000 | 0.1 | ~0.005 ETH | ~€10 |

*EUR estimates based on ETH price of €2,000/ETH. Actual costs may vary based on market conditions and gas prices.

### Ongoing Costs

| Item | Monthly Estimate | Annual Estimate |
|------|------------------|-----------------|
| RPC API Calls (Alchemy) | Free tier for initial usage | €0-50/month based on volume |
| POAP API Calls | Free tier for initial usage | €0-20/month based on volume |
| **Total Ongoing** | **€0-70/month** | **€0-840/year** |

## Responsibilities

### mission-enrollment.base.eth (0xF0bC5CC2B4866dAAeCb069430c60b24520077037)

1. **Smart Contract Deployment**:
   - Deploy AttestationService.sol to Base mainnet
   - Create attestation schema on Base mainnet
   - Verify contract on Base mainnet explorer

2. **Contract Administration**:
   - Manage attestation creator roles
   - Monitor contract usage and security

3. **Financial Responsibilities**:
   - Cover deployment gas costs
   - Fund attestation creation for users (if applicable)

### daqhris.base.eth (0xb5ee030c71e76c3e03b2a8d425dbb9b395037c82)

1. **Frontend Development**:
   - Update network configuration
   - Modify UI components
   - Test application with Base mainnet

2. **Documentation**:
   - Update technical documentation
   - Create user guides for Base mainnet

3. **User Support**:
   - Provide support for users during migration
   - Address issues that arise during migration

### Devin AI

1. **Technical Implementation**:
   - Provide code updates for Base mainnet migration
   - Test and validate changes
   - Assist with deployment process

2. **Documentation**:
   - Create migration roadmap
   - Document technical changes

3. **Support**:
   - Provide technical support during migration
   - Assist with troubleshooting issues

## Testing Strategy

1. **Unit Testing**:
   - Test network switching logic
   - Test attestation creation with Base mainnet configuration
   - Test POAP verification with Base mainnet

2. **Integration Testing**:
   - Test end-to-end user flow on Base mainnet
   - Verify wallet connections and transactions
   - Test error handling and recovery

3. **User Acceptance Testing**:
   - Limited release to selected users
   - Gather feedback and fix issues
   - Verify user experience on Base mainnet

## Deployment Checklist

1. **Pre-Deployment**:
   - [ ] Update environment variables
   - [ ] Deploy smart contracts to Base mainnet
   - [ ] Create attestation schema on Base mainnet
   - [ ] Update schema UID in constants
   - [ ] Test application with Base mainnet configuration

2. **Deployment**:
   - [ ] Update production environment variables
   - [ ] Deploy application to production
   - [ ] Verify deployment success
   - [ ] Test production application

3. **Post-Deployment**:
   - [ ] Monitor transactions and user interactions
   - [ ] Address any issues that arise
   - [ ] Update documentation

## Post-Deployment Verification

1. **Transaction Monitoring**:
   - Monitor attestation creation transactions
   - Verify transaction success and gas costs
   - Address any transaction failures

2. **User Experience**:
   - Gather user feedback
   - Verify user flow works as expected
   - Address any user experience issues

3. **Performance Monitoring**:
   - Monitor application performance
   - Verify API response times
   - Address any performance issues

## Rollback Plan

In case of critical issues with the Base mainnet deployment, the following rollback plan will be implemented:

1. **Revert Frontend Changes**:
   - Revert network configuration to use Base Sepolia for attestations
   - Deploy reverted changes to production

2. **Maintain Dual Support**:
   - Keep Base mainnet contracts deployed
   - Allow users to choose between Base Sepolia and Base mainnet (if applicable)

3. **Communication**:
   - Inform users of the rollback
   - Provide timeline for resolving issues and re-attempting migration

## Conclusion

This migration roadmap provides a comprehensive plan for migrating the Mission Enrollment application from Base Sepolia to Base mainnet. By following this plan, the migration can be executed smoothly with minimal disruption to users.

The migration will enhance the application by moving from a testnet to a production network, providing real-world value to attestations and improving the overall user experience. The estimated costs are reasonable for a blockchain application deployment, and the responsibilities are clearly defined between the project stakeholders.
