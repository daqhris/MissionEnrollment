# EAS Schema Draft for Mission Enrollment

This document outlines a proposed update to the Ethereum Attestation Service (EAS) schema used for Mission Enrollment attestations, aligning field names with UI terminology and ensuring proper data structure.

## Current Schema Structure

The current schema (Schema 1157) uses the following encoding:
```typescript
"address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol,string verificationSource,string verificationTimestamp,string verificationSignature,string verificationHash"
```

## Proposed Schema Structure

The proposed schema includes field name updates to align with UI terminology while maintaining backward compatibility:
```typescript
"address userAddress,string onchainName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address publicAttester,string proofProtocol,string schemaDeployer,string verificationTime,string verificationSignature,string verificationHash"
```

## Field Descriptions

| Field Name | Type | Description | UI Display Name |
|------------|------|-------------|----------------|
| userAddress | address | Wallet address of the attestation recipient | User Address |
| onchainName | string | User's Base name (e.g., name.base.eth) | Onchain Name |
| proofMethod | string | Method used to verify identity (e.g., "Basename Protocol") | Proof Method |
| eventName | string | Name of the event attended (e.g., "ETHGlobal Brussels 2024") | Event Name |
| eventType | string | Type of event (e.g., "International Hackathon") | Event Type |
| assignedRole | string | Role assigned based on POAP data (e.g., Hacker, Mentor, Speaker) | Assigned Role |
| missionName | string | Name of the collaborative mission (e.g., "Zinneke Rescue Mission") | Mission |
| timestamp | uint256 | Timestamp of attestation creation in milliseconds | (Not displayed) |
| publicAttester | address | Address of the attestation creator (mission-enrollment.base.eth) | Public Attester |
| proofProtocol | string | Protocol used for verification (e.g., "EAS Schema #1157") | Proof Protocol |
| schemaDeployer | string | Source of the schema (e.g., "mission-enrollment.base.eth") | Schema Deployer |
| verificationTime | string | ISO timestamp of verification | Verification Time |
| verificationSignature | string | EIP-712 signature for verification | Signature |
| verificationHash | string | Hash of verification data | Hash |

## EIP-712 Structure

The EIP-712 structure for type-safe signing should be updated to match the schema:

```typescript
const EIP712_TYPES = {
  Verification: [
    { name: 'userAddress', type: 'address' },
    { name: 'eventName', type: 'string' },
    { name: 'assignedRole', type: 'string' },
    { name: 'onchainName', type: 'string' },
    { name: 'timestamp', type: 'uint256' }
  ]
};
```

## Implementation Notes

1. **Role Information**: Roles should be dynamically retrieved from the user's POAP data rather than hardcoded. The possible roles include:
   - ETH_GLOBAL_BRUSSELS: Hacker, Mentor, Judge, Sponsor, Speaker, Volunteer, Staff
   - ETHDENVER_COINBASE_CDP_2025: Speaker, Sponsor, Mentor, Judge, Developer, Hacker, Social Participant, BUIDLer

2. **Base Names**: Base names should be formatted consistently, removing duplicate suffixes like ".base.eth.base.eth"

3. **Timestamp Handling**: Timestamps should be stored as milliseconds since epoch (using `Date.now()`) and formatted for display without "T" and "Z" characters

4. **Attester Address**: The attester's wallet address in attestation data should match the wallet that deployed the schema on Base Sepolia

5. **Network Specifics**: The schema is intended for use on Base Sepolia testnet with proper display on EAS Explorer at https://base-sepolia.easscan.org/schema/view/0x24e3eb564e8e879fbcae9b5d16ebf0d7d880cf5ec58fef0d4f74c9d6f594475e
