import { Attestation } from '../types/attestation';

export const mockEnrollments: Attestation[] = [
  {
    id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    attester: "0x4200000000000000000000000000000000000021",
    recipient: "0xb5ee0c477cbc91fe1c1869cae75e7c1b8a7a6f9f",
    refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
    revocable: true,
    revocationTime: null,
    expirationTime: null,
    time: 1712345678,
    data: "0x0000000000000000000000000000000000000000000000000000000000000000",
    decodedDataJson: JSON.stringify([
      {
        name: "userAddress",
        type: "address",
        signature: "address userAddress",
        value: {
          name: "address",
          type: "address",
          value: "0xb5ee0c477cbc91fe1c1869cae75e7c1b8a7a6f9f"
        }
      },
      {
        name: "verifiedName",
        type: "string",
        signature: "string verifiedName",
        value: {
          name: "string",
          type: "string",
          value: "daqhris.base.eth"
        }
      },
      {
        name: "proofMethod",
        type: "string",
        signature: "string proofMethod",
        value: {
          name: "string",
          type: "string",
          value: "Basename Protocol"
        }
      },
      {
        name: "eventName",
        type: "string",
        signature: "string eventName",
        value: {
          name: "string",
          type: "string",
          value: "ETHGlobal Brussels 2024"
        }
      },
      {
        name: "eventType",
        type: "string",
        signature: "string eventType",
        value: {
          name: "string",
          type: "string",
          value: "International Hackathon"
        }
      },
      {
        name: "assignedRole",
        type: "string",
        signature: "string assignedRole",
        value: {
          name: "string",
          type: "string",
          value: "Hacker"
        }
      },
      {
        name: "missionName",
        type: "string",
        signature: "string missionName",
        value: {
          name: "string",
          type: "string",
          value: "Zinneke Rescue Mission"
        }
      },
      {
        name: "timestamp",
        type: "uint256",
        signature: "uint256 timestamp",
        value: {
          name: "uint256",
          type: "uint256",
          value: 1712345678
        }
      },
      {
        name: "attester",
        type: "address",
        signature: "address attester",
        value: {
          name: "address",
          type: "address",
          value: "0x4200000000000000000000000000000000000021"
        }
      },
      {
        name: "proofProtocol",
        type: "string",
        signature: "string proofProtocol",
        value: {
          name: "string",
          type: "string",
          value: "EAS Protocol"
        }
      }
    ])
  },
  {
    id: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    attester: "0x4200000000000000000000000000000000000021",
    recipient: "0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4",
    refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
    revocable: true,
    revocationTime: null,
    expirationTime: null,
    time: 1712245678,
    data: "0x0000000000000000000000000000000000000000000000000000000000000000",
    decodedDataJson: JSON.stringify([
      {
        name: "userAddress",
        type: "address",
        signature: "address userAddress",
        value: {
          name: "address",
          type: "address",
          value: "0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4"
        }
      },
      {
        name: "verifiedName",
        type: "string",
        signature: "string verifiedName",
        value: {
          name: "string",
          type: "string",
          value: "user.base.eth"
        }
      },
      {
        name: "proofMethod",
        type: "string",
        signature: "string proofMethod",
        value: {
          name: "string",
          type: "string",
          value: "Basename Protocol"
        }
      },
      {
        name: "eventName",
        type: "string",
        signature: "string eventName",
        value: {
          name: "string",
          type: "string",
          value: "ETHGlobal Brussels 2024"
        }
      },
      {
        name: "eventType",
        type: "string",
        signature: "string eventType",
        value: {
          name: "string",
          type: "string",
          value: "International Hackathon"
        }
      },
      {
        name: "assignedRole",
        type: "string",
        signature: "string assignedRole",
        value: {
          name: "string",
          type: "string",
          value: "Builder"
        }
      },
      {
        name: "missionName",
        type: "string",
        signature: "string missionName",
        value: {
          name: "string",
          type: "string",
          value: "Zinneke Rescue Mission"
        }
      },
      {
        name: "timestamp",
        type: "uint256",
        signature: "uint256 timestamp",
        value: {
          name: "uint256",
          type: "uint256",
          value: 1712245678
        }
      },
      {
        name: "attester",
        type: "address",
        signature: "address attester",
        value: {
          name: "address",
          type: "address",
          value: "0x4200000000000000000000000000000000000021"
        }
      },
      {
        name: "proofProtocol",
        type: "string",
        signature: "string proofProtocol",
        value: {
          name: "string",
          type: "string",
          value: "EAS Protocol"
        }
      }
    ])
  }
];

export const mockAttestationsCount = 2;
