'use client';

import { LocalAccountSigner } from "@alchemy/aa-core";
import { createSmartAccountClient } from "./accountAbstraction";
import { SUPPORTED_CHAINS } from "./wagmi";

export const createLocalAccountSigner = async () => {
  const privateKey = crypto.getRandomValues(new Uint8Array(32));
  return LocalAccountSigner.privateKeyToAccountSigner(`0x${Buffer.from(privateKey).toString('hex')}`);
};

export const initializeSmartAccount = async (chainId: number = SUPPORTED_CHAINS.BASE_MAINNET) => {
  try {
    const signer = await createLocalAccountSigner();
    
    const smartAccountClient = await createSmartAccountClient(chainId, signer);
    
    const address = await signer.getAddress();
    
    return {
      smartAccountClient,
      address,
    };
  } catch (error) {
    console.error("Error initializing smart account:", error);
    throw error;
  }
};

export const isSmartAccountSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    if (!window.crypto || !window.crypto.subtle) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking smart account support:", error);
    return false;
  }
};
