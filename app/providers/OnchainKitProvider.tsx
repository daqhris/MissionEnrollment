import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { baseMainnet } from '../config/chains';
import { type Chain } from 'viem';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  // Get the default chain from environment or use Base Mainnet
  const defaultChain = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8453');
  const chain = defaultChain === 8453 ? baseMainnet : baseMainnet;

  return (
    <BaseOnchainKitProvider
      chain={chain as Chain}
      projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string}
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
