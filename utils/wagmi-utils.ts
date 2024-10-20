import { useCallback, useEffect, useState } from "react";
import { JsonRpcProvider, BrowserProvider, Signer } from 'ethers';
import type { HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient): JsonRpcProvider {
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
    const providerList = (transport.transports as ReturnType<HttpTransport>[])
      .map(({ value }) => value?.url ? new JsonRpcProvider(value.url, network) : undefined)
      .filter((provider): provider is JsonRpcProvider => provider !== undefined);

    if (providerList.length === 1) {
      const provider = providerList[0];
      if (provider) return provider;
    }
    if (providerList.length > 1) return new JsonRpcProvider(transport.url || "", network);
  }
  return new JsonRpcProvider(transport.url || "", network);
}

export async function walletClientToSigner(walletClient: WalletClient): Promise<Signer> {
  const { account, chain, transport } = walletClient;

  if (!chain) throw new Error("Chain not found");
  if (!account) throw new Error("Account not found");

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport as any, network);
  return provider.getSigner(account.address);
}

export function useSigner(): Signer | undefined {
  const { data: walletClient } = useWalletClient();
  const [signer, setSigner] = useState<Signer | undefined>(undefined);

  const getSigner = useCallback(async () => {
    if (!walletClient) {
      setSigner(undefined);
      return;
    }

    try {
      const newSigner = await walletClientToSigner(walletClient as WalletClient);
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

export function useProvider(): JsonRpcProvider | undefined {
  const publicClient = usePublicClient();
  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(undefined);

  const getProvider = useCallback(() => {
    if (!publicClient) return;

    const tmpProvider = publicClientToProvider(publicClient as PublicClient);
    setProvider(tmpProvider);
  }, [publicClient]);

  useEffect(() => {
    getProvider();
  }, [getProvider]);

  return provider;
}
