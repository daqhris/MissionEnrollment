import { useCallback, useEffect, useState } from "react";
import { ethers } from 'ethers';
import type { HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient): ethers.providers.JsonRpcProvider {
  const { chain, transport } = publicClient;

  if (!chain) {
    throw new Error("Chain not found");
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    const providerList = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new ethers.providers.JsonRpcProvider(value?.url || "")
    );
    if (providerList.length === 1) return providerList[0];
    return new ethers.providers.JsonRpcProvider(transport.url);
  }
  return new ethers.providers.JsonRpcProvider(transport.url);
}

export async function walletClientToSigner(walletClient: WalletClient): Promise<ethers.Signer> {
  const { account, chain, transport } = walletClient;

  if (!chain) throw new Error("Chain not found");
  if (!account) throw new Error("Account not found");

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.providers.Web3Provider(transport as any);
  return provider.getSigner(account.address);
}

export function useSigner(): ethers.Signer | undefined {
  const { data: walletClient } = useWalletClient();
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);

  const getSigner = useCallback(async () => {
    if (!walletClient) {
      setSigner(undefined);
      return;
    }

    try {
      const newSigner = await walletClientToSigner(walletClient);
      setSigner(newSigner);
    } catch (error) {
      console.error("Error getting signer:", error);
      setSigner(undefined);
    }
  }, [walletClient]);

  useEffect(() => {
    void getSigner();
  }, [getSigner]);

  return signer;
}

export function useProvider(): ethers.providers.JsonRpcProvider | undefined {
  const publicClient = usePublicClient();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | undefined>(undefined);

  const getProvider = useCallback(() => {
    if (!publicClient) return;

    const tmpProvider = publicClientToProvider(publicClient);
    setProvider(tmpProvider);
  }, [publicClient]);

  useEffect(() => {
    getProvider();
  }, [getProvider]);

  return provider;
}
