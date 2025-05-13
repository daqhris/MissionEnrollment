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

/**
 * Signs a verification message using EIP-712 typed data
 * This function handles the first wallet interaction where the user verifies their identity
 * The signed message contains the user's address, name, role, and event information
 */
export async function signVerification(signer: any, userAddress: string, eventInfo: any): Promise<string> {
  if (!signer) {
    throw new Error('Invalid signer: signer is undefined or null');
  }
  
  const messageData = {
    userAddress,
    eventName: eventInfo.eventName,
    role: eventInfo.role,
    verifiedName: eventInfo.approvedName || eventInfo.verifiedName || '',
    timestamp: Date.now()
  };
  
  try {
    console.log("Wallet signer details:", {
      type: typeof signer,
      methods: Object.keys(signer),
      provider: signer.provider ? 'available' : 'unavailable'
    });
    
    console.log("Signing identity verification for Zinneke Rescue Mission enrollment:", {
      ...messageData,
      domain: EIP712_DOMAIN
    });
    
    if (typeof signer.signTypedData === 'function') {
      return await signer.signTypedData(
        EIP712_DOMAIN,
        EIP712_TYPES,
        messageData
      );
    } 
    else if (typeof signer._signTypedData === 'function') {
      return await signer._signTypedData(
        EIP712_DOMAIN,
        EIP712_TYPES,
        messageData
      );
    }
    else if (signer.provider && typeof signer.provider.send === 'function') {
      return await signer.provider.send('eth_signTypedData_v4', [
        await signer.getAddress(),
        JSON.stringify({
          domain: EIP712_DOMAIN,
          types: EIP712_TYPES,
          message: messageData
        })
      ]);
    }
    else {
      throw new Error('Your wallet does not support EIP-712 signing. Please try a different wallet or contact support.');
    }
  } catch (error) {
    console.error('Error signing verification:', error);
    throw new Error(`Failed to sign verification message: ${error.message || 'Unknown error'}`);
  }
}
