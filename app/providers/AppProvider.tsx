'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import wagmiConfig from '../config/wagmi';
import { base } from 'viem/chains';
import { logger } from '../utils/logger';

// Create a client
const queryClient = new QueryClient();

if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
  throw new Error('NEXT_PUBLIC_CDP_API_KEY is required');
}

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Check for wagmi initialization errors
  if (wagmiConfig.hasError || !wagmiConfig.isValid) {
    logger.error('AppProvider', 'Wagmi initialization error', wagmiConfig.error);
    throw new Error('Failed to initialize wallet configuration');
  }

  return (
    <WagmiProvider config={wagmiConfig.config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
          projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
