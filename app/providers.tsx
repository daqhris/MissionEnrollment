'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'viem/chains';
import config from './config/wagmi';
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
  const result = { isValid: true, missing: [] as string[] };
  if (!ENV.ALCHEMY_API_KEY) result.missing.push('ALCHEMY_API_KEY');
  if (!ENV.WALLET_CONNECT_PROJECT_ID) result.missing.push('WALLET_CONNECT_PROJECT_ID');
  if (!ENV.CDP_API_KEY) result.missing.push('CDP_API_KEY');
  if (result.missing.length > 0) {
    result.isValid = false;
    console.error('[Providers] Missing environment variables:', result.missing.join(', '));
  }
  return result;
};

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  console.log('[Providers] Component rendering started');

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Log environment variables early (without values for security)
  console.log('[Providers] Available env vars:', {
    ALCHEMY_API_KEY: !!ENV.ALCHEMY_API_KEY,
    WALLET_CONNECT_PROJECT_ID: !!ENV.WALLET_CONNECT_PROJECT_ID,
    CDP_API_KEY: !!ENV.CDP_API_KEY
  });

  useEffect(() => {
    console.log('[Providers] useEffect initialization starting');

    try {
      console.log('[Providers] Initializing providers...');

      // Check environment variables
      const envCheck = checkEnv();
      if (!envCheck.isValid) {
        console.error('[Providers] Environment check failed:', envCheck.missing);
        throw new Error(`Missing required environment variables: ${envCheck.missing.join(', ')}`);
      }
      console.log('[Providers] Environment variables verified');

      // Log wagmi config details (without sensitive data)
      console.log('[Providers] Wagmi config check:', {
        hasConfig: !!config,
        configKeys: config ? Object.keys(config) : []
      });

      // Use pre-configured wagmi config
      if (!config) {
        console.error('[Providers] Wagmi config is missing or invalid');
        throw new Error('Invalid wagmi configuration');
      }
      console.log('[Providers] Using pre-configured wagmi config');

      // Additional checks for critical dependencies
      const missingDependencies = [];
      if (!WagmiProvider) missingDependencies.push('WagmiProvider');
      if (!QueryClientProvider) missingDependencies.push('QueryClientProvider');
      if (!OnchainKitProvider) missingDependencies.push('OnchainKitProvider');

      if (missingDependencies.length > 0) {
        const errorMessage = `Missing critical dependencies: ${missingDependencies.join(', ')}`;
        console.error('[Providers] Dependency check failed:', errorMessage);
        throw new Error(errorMessage);
      }

      setMounted(true);
      console.log('[Providers] Providers initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during initialization';
      console.error('[Providers] Initialization failed:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        type: err instanceof Error ? err.constructor.name : typeof err,
        timestamp: new Date().toISOString()
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
    }
  }, []);

  if (error) {
    console.error('[Providers] Rendering error state:', error.message);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-red-600">
          <div className="font-bold">Provider Initialization Failed</div>
          <div className="text-sm mt-2">{error.message}</div>
          <div className="text-xs mt-1 text-gray-500">Please check the console for more details.</div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    console.log('[Providers] Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Initializing providers...</div>
      </div>
    );
  }

  console.log('[Providers] Rendering providers');
  return (
    <WagmiProvider config={config}>
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
