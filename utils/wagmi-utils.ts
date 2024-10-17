import { useCallback, useEffect, useState } from "react";
import { JsonRpcProvider, FallbackProvider, BrowserProvider, Signer } from 'ethers/lib.commonjs';
import type { HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient): JsonRpcProvider | FallbackProvider {
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
      ({ value }) => new JsonRpcProvider(value?.url || "")
    );
    if (providerList.length === 1) return providerList[0] as JsonRpcProvider;
    return new FallbackProvider(providerList);
  }
  return new JsonRpcProvider(transport.url);
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
  const provider = new BrowserProvider(transport as any);
  return provider.getSigner();
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

export function useProvider(): JsonRpcProvider | FallbackProvider | undefined {
  const publicClient = usePublicClient();
  const [provider, setProvider] = useState<JsonRpcProvider | FallbackProvider | undefined>(undefined);

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
