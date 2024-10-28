'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'viem/chains';
import { createWagmiConfig } from './config/wagmi';
import { ReactNode, useState, useEffect } from 'react';
import { ENV } from './config/env';

// Create a single QueryClient instance that can be reused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Simple environment check for required variables
const checkEnv = () => {
  const missing = [];
  if (!ENV.ALCHEMY_API_KEY) missing.push('ALCHEMY_API_KEY');
  if (!ENV.WALLET_CONNECT_PROJECT_ID) missing.push('WALLET_CONNECT_PROJECT_ID');
  if (!ENV.CDP_API_KEY) missing.push('CDP_API_KEY');
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createWagmiConfig> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      console.log('[Providers] Initializing providers...');

      // Check environment variables
      checkEnv();
      console.log('[Providers] Environment variables verified');

      // Create wagmi config
      const config = createWagmiConfig({
        alchemyApiKey: ENV.ALCHEMY_API_KEY,
        wcProjectId: ENV.WALLET_CONNECT_PROJECT_ID,
      });
      console.log('[Providers] Wagmi config created');

      setWagmiConfig(config);
      setMounted(true);
      console.log('[Providers] Providers initialized successfully');
    } catch (err) {
      console.error('[Providers] Initialization failed:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during initialization'));
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-red-600">
          <div className="font-bold">Provider Initialization Failed</div>
          <div className="text-sm mt-2">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!mounted || !wagmiConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Initializing providers...</div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ENV.CDP_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
