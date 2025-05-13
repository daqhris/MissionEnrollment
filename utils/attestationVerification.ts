import { TypedDataDomain } from "viem";

const EIP712_DOMAIN = {
  name: 'Mission Enrollment',
  version: '1',
  chainId: 84532, // Base Sepolia chain ID
  verifyingContract: '0xF0bC5CC2B4866dAAeCb069430c60b24520077037' // Attester contract
};

const EIP712_TYPES = {
  Verification: [
    { name: 'userAddress', type: 'address' },
    { name: 'eventName', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'verifiedName', type: 'string' },
    { name: 'timestamp', type: 'uint256' }
  ]
};

export function generateVerificationSignature(userAddress: string, eventInfo: any): string {
  const messageData = {
    userAddress,
    eventName: eventInfo.eventName,
    role: eventInfo.role,
    verifiedName: eventInfo.verifiedName || '',
    timestamp: Date.now()
  };
  
  return `0x${Buffer.from(JSON.stringify(messageData)).toString('hex')}`;
}

export function generateVerificationHash(userAddress: string, eventInfo: any): string {
  const data = JSON.stringify({
    userAddress,
    eventName: eventInfo.eventName,
    role: eventInfo.role,
    timestamp: Date.now()
  });
  return `0x${Buffer.from(data).toString('hex')}`;
}

export async function signVerification(signer: any, userAddress: string, eventInfo: any): Promise<string> {
  if (!signer || typeof signer._signTypedData !== 'function') {
    throw new Error('Invalid signer or signer does not support EIP-712 signing');
  }
  
  const messageData = {
    userAddress,
    eventName: eventInfo.eventName,
    role: eventInfo.role,
    verifiedName: eventInfo.approvedName || eventInfo.verifiedName || '',
    timestamp: Date.now()
  };
  
  try {
    console.log("Signing message for Zinneke Rescue Mission enrollment with the following data:", {
      ...messageData,
      domain: EIP712_DOMAIN
    });
    
    return await signer._signTypedData(
      EIP712_DOMAIN,
      EIP712_TYPES,
      messageData
    );
  } catch (error) {
    console.error('Error signing verification:', error);
    throw new Error('Failed to sign verification message');
  }
}
