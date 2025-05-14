# EAS Schema Implementation Guide

This document provides code examples for implementing the updated EAS schema in the Mission Enrollment application.

## Schema Constants Update

```typescript
// In utils/constants.ts
export const SCHEMA_UID_UPDATED = '0x...'; // New schema UID after deployment
export const SCHEMA_ENCODING_UPDATED = "address userAddress,string onchainName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address publicAttester,string proofProtocol,string schemaDeployer,string verificationTime,string verificationSignature,string verificationHash";
```

## Schema Data Interface Update

```typescript
// In types/attestation.ts
export interface SchemaData {
  userAddress: string;      // address - wallet address
  onchainName: string;      // string - verified name from Basename
  proofMethod: string;      // string - "Basename Protocol"
  eventName: string;        // string - "ETHGlobal Brussels 2024"
  eventType: string;        // string - "International Hackathon"
  assignedRole: string;     // string - dynamic role from POAP
  missionName: string;      // string - "Zinneke Rescue Mission"
  timestamp: number;        // uint256 - block timestamp
  publicAttester: string;   // address - MISSION_ENROLLMENT_BASE_ETH_ADDRESS
  proofProtocol: string;    // string - "EAS Protocol"
  schemaDeployer: string;   // string - "mission-enrollment.base.eth"
  verificationTime: string; // string - ISO timestamp
  verificationSignature: string; // string - app-generated signature
  verificationHash: string; // string - deterministic hash
}
```

## EIP-712 Types Update

```typescript
// In utils/attestationVerification.ts
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

## Schema Encoder Update

```typescript
// In components/EnrollmentAttestation.tsx
const schemaEncoder = new SchemaEncoder(SCHEMA_ENCODING_UPDATED);
const encodedData = schemaEncoder.encodeData([
  { name: "userAddress", value: previewData.userAddress, type: "address" },
  { name: "onchainName", value: previewData.approvedName, type: "string" },
  { name: "proofMethod", value: previewData.proofMethod, type: "string" },
  { name: "eventName", value: previewData.eventName, type: "string" },
  { name: "eventType", value: previewData.eventType, type: "string" },
  { name: "assignedRole", value: previewData.assignedRole, type: "string" },
  { name: "missionName", value: previewData.missionName, type: "string" },
  { name: "timestamp", value: previewData.timestamp, type: "uint256" },
  { name: "publicAttester", value: previewData.attester, type: "address" },
  { name: "proofProtocol", value: previewData.proofProtocol, type: "string" },
  { name: "schemaDeployer", value: previewData.verificationSource, type: "string" },
  { name: "verificationTime", value: previewData.verificationTimestamp, type: "string" },
  { name: "verificationSignature", value: signature, type: "string" },
  { name: "verificationHash", value: previewData.verificationHash, type: "string" }
]);
```

## Field Labels Update

```typescript
// In utils/formatting.ts
export function getFieldLabel(name: string): string {
  const labels: Record<string, string> = {
    userAddress: 'User Address',
    onchainName: 'Onchain Name',
    proofMethod: 'Proof Method',
    eventName: 'Event',
    eventType: 'Type',
    assignedRole: 'Role',
    missionName: 'Mission',
    publicAttester: 'Public Attester',
    proofProtocol: 'Proof Protocol',
    schemaDeployer: 'Schema Deployer',
    verificationTime: 'Verification Time',
    verificationSignature: 'Signature',
    verificationHash: 'Hash'
  };
  return labels[name] || name;
}
```
