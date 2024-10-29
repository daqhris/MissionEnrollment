'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'viem/chains';
import config from './config/wagmi';
import { ReactNode, useState, useEffect } from 'react';
import { ENV, checkRequiredEnvVars } from './config/env';

// Create a single QueryClient instance that can be reused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  console.log('[Providers] Component rendering started');

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [envStatus, setEnvStatus] = useState<{ isValid: boolean; missing: string[] }>({ isValid: true, missing: [] });

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
      const envCheck = checkRequiredEnvVars();
      setEnvStatus(envCheck);
      console.log('[Providers] Environment check result:', envCheck);

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

  if (!mounted || error || !envStatus.isValid) {
    const message = error ? error.message :
      !envStatus.isValid ? `Missing required environment variables: ${envStatus.missing.join(', ')}` :
      'Initializing providers...';

    const isError = error || !envStatus.isValid;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className={`p-8 rounded-lg shadow-md ${isError ? 'bg-red-50' : 'bg-white'}`}>
          <div className={`text-lg font-semibold mb-2 ${isError ? 'text-red-600' : 'text-gray-700'}`}>
            {isError ? 'Initialization Error' : 'Loading'}
          </div>
          <div className={`text-sm ${isError ? 'text-red-500' : 'text-gray-500'}`}>
            {message}
          </div>
          {isError && (
            <div className="mt-4 text-xs text-gray-500">
              Please check that all required environment variables are set correctly.
            </div>
          )}
        </div>
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
