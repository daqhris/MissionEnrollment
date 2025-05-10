export interface SchemaData {
  userAddress: string;      // address - wallet address
  verifiedName: string;     // string - verified name from Basename
  proofMethod: string;      // string - "Basename Protocol"
  eventName: string;        // string - "ETHGlobal Brussels 2024"
  eventType: string;        // string - "International Hackathon"
  assignedRole: string;     // string - dynamic role from POAP
  missionName: string;      // string - "Zinneke Rescue Mission"
  timestamp: number;        // uint256 - block timestamp
  attester: string;         // address - MISSION_ENROLLMENT_BASE_ETH_ADDRESS
  proofProtocol: string;    // string - "EAS Protocol"
  verificationSource: string; // string - "mission-enrollment.base.eth"
  verificationTimestamp: string; // string - ISO timestamp
  verificationSignature: string; // string - app-generated signature
  verificationHash: string; // string - deterministic hash
}

export const SCHEMA_ENCODING = "address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol,string verificationSource,string verificationTimestamp,string verificationSignature,string verificationHash";

export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: string | null;
  expirationTime: string | null;
  time: number;  // Changed from string to number to match GraphQL response
  data: string;
  decodedDataJson: string;  // Made required as it's always present in responses
}

export interface AttestationData {
  name: string;
  type: string;
  signature: string;
  value: {
    name: string;
    type: string;
    value: string | number | boolean | { type: string; hex: string };
  };
}

export interface AttestationQueryResponse {
  attestations: Attestation[];
  attestationsCount: number;
}
