'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import wagmiConfig from '../config/wagmi';
import { baseMainnet } from '../config/chains';
import { logger } from '../utils/logger';
import { ENV, checkRequiredEnvVars } from '../config/env';

// Create a client
const queryClient = new QueryClient();

// Check required environment variables early
try {
  checkRequiredEnvVars();
} catch (error) {
  logger.error('AppProvider', 'Environment check failed', error);
  throw error;
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
          apiKey={ENV.CDP_API_KEY}
          chain={baseMainnet}
          projectId={ENV.WALLET_CONNECT_PROJECT_ID}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
