'use client';

import { createLightAccountClient } from "@alchemy/aa-accounts";
import { SmartAccountSigner, type SmartAccountClient } from "@alchemy/aa-core";
import { http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { NEXT_PUBLIC_ALCHEMY_API_KEY } from "./env";
import { SUPPORTED_CHAINS } from "./wagmi";

export const createSmartAccountClient = async (
  chainId: number,
  signer: SmartAccountSigner
): Promise<SmartAccountClient> => {
  try {
    const transport = http(
      chainId === SUPPORTED_CHAINS.BASE_MAINNET
        ? `https://base-mainnet.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
        : `https://base-sepolia.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
    
    const chain = chainId === SUPPORTED_CHAINS.BASE_MAINNET ? base : baseSepolia;
    
    return createLightAccountClient({
      transport,
      chain,
      signer,
    });
  } catch (error) {
    console.error("Error creating smart account client:", error);
    throw error;
  }
};

export const canSponsorTransaction = async (
  _client: SmartAccountClient,
  _to: `0x${string}`,
  _data: `0x${string}`,
  _value: bigint = BigInt(0) // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<boolean> => {
  try {
    return true;
  } catch (error) {
    console.error("Error checking gas sponsorship eligibility:", error);
    return false;
  }
};

export const sendGaslessTransaction = async (
  client: SmartAccountClient,
  to: `0x${string}`,
  data: `0x${string}`,
  value: bigint = BigInt(0)
): Promise<`0x${string}`> => {
  try {
    const hash = await client.sendTransaction({
      to,
      data,
      value,
    } as any); // Type cast to fix parameter type issue
    
    return hash;
  } catch (error) {
    console.error("Error sending gasless transaction:", error);
    throw error;
  }
};
