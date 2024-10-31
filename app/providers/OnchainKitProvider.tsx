import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { type Chain } from 'viem';
import ErrorBoundary from '../../components/ErrorBoundary';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  // Get the default chain from environment or use Base Mainnet
  const defaultChain = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8453');
  const chain = defaultChain === 8453 ? base : base;
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

  if (!apiKey) {
    console.warn('OnchainKit API key not found in environment variables');
  }

  return (
    <ErrorBoundary>
      <BaseOnchainKitProvider
        chain={chain as Chain}
        apiKey={apiKey}
        config={{
          appearance: {
            mode: 'light'
          }
        }}
      >
        {children}
      </BaseOnchainKitProvider>
    </ErrorBoundary>
  );
}
