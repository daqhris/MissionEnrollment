import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { type Chain } from 'viem';
import { base } from 'viem/chains';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined');
  }

  if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
    throw new Error('NEXT_PUBLIC_CDP_API_KEY is not defined');
  }

  // Use Base Mainnet as the default chain
  const chain: Chain = base;

  return (
    <BaseOnchainKitProvider
      chain={chain}
      projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      config={{
        appearance: {
          mode: 'light'
        }
      }}
    >
      {children}
    </BaseOnchainKitProvider>
  );
}
