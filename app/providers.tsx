'use client';

import { initSentry } from "./utils/sentry";
import { captureException } from "@sentry/nextjs";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { ReactNode, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { logger } from './utils/logger';
import { ENV, checkRequiredEnvVars } from './config/env';
import wagmiConfig from './config/wagmi';
import type { WagmiConfig } from './types/wagmi';
import { baseMainnet } from './config/chains';

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

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-lg shadow-md bg-red-50">
        <div className="text-lg font-semibold mb-2 text-red-600">
          Application Error
        </div>
        <div className="text-sm text-red-500">
          {error.message}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Please check the browser console for more details.
        </div>
      </div>
    </div>
  );
}

initSentry();
export default function Providers({ children }: ProvidersProps): JSX.Element {
  logger.info('Providers', 'Component rendering started');

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Log environment variables early (without values for security)
  logger.info('Providers', 'Available env vars', {
    ALCHEMY_API_KEY: !!ENV.ALCHEMY_API_KEY,
    WALLET_CONNECT_PROJECT_ID: !!ENV.WALLET_CONNECT_PROJECT_ID,
    CDP_API_KEY: !!ENV.CDP_API_KEY
  });

  useEffect(() => {
    console.log('[Providers] useEffect initialization starting');

    try {
      logger.info('Providers', 'Initializing providers...');

      // Check environment variables
      try {
        checkRequiredEnvVars();
        logger.info('Providers', 'Environment check passed');
      } catch (envError) {
        captureException(envError);
        logger.error('Providers', 'Environment check failed', envError);
        throw envError;
      }

      // Log wagmi config details (without sensitive data)
      logger.info('Providers', 'Wagmi config check', {
        hasConfig: !!wagmiConfig.config,
        hasError: wagmiConfig.hasError,
        errorMessage: wagmiConfig.error?.message,
        isValid: wagmiConfig.isValid
      });

      // Use pre-configured wagmi config
      if (!wagmiConfig.config || !wagmiConfig.isValid) {
        const configError = new Error('Invalid wagmi configuration');
        captureException(configError);
        logger.error('Providers', 'Wagmi config is missing or invalid', wagmiConfig.error);
        throw configError;
      }
      logger.info('Providers', 'Using pre-configured wagmi config');

      // Additional checks for critical dependencies
      const missingDependencies: string[] = [];
      if (!WagmiProvider) missingDependencies.push('WagmiProvider');
      if (!QueryClientProvider) missingDependencies.push('QueryClientProvider');
      if (!OnchainKitProvider) missingDependencies.push('OnchainKitProvider');

      if (missingDependencies.length > 0) {
        const dependencyError = new Error(`Missing critical dependencies: ${missingDependencies.join(', ')}`);
        captureException(dependencyError);
        logger.error('Providers', 'Dependency check failed', { missingDependencies });
        throw dependencyError;
      }

      setMounted(true);
      logger.info('Providers', 'Providers initialized successfully');
    } catch (err) {
      const errorToSet = err instanceof Error ? err : new Error('Unknown error during initialization');
      captureException(errorToSet);
      logger.error('Providers', 'Initialization failed', {
        error: err,
        message: errorToSet.message,
        stack: errorToSet.stack,
        type: err instanceof Error ? err.constructor.name : typeof err,
        timestamp: new Date().toISOString()
      });
      setError(errorToSet);
    }
  }, []);

  if (!mounted || error) {
    const message = error ? error.message : 'Initializing providers...';
    const isError = !!error;

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
              Please check the browser console for more details.
            </div>
          )}
        </div>
      </div>
    );
  }

  logger.info('Providers', 'Rendering providers');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WagmiProvider config={wagmiConfig.config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={ENV.CDP_API_KEY}
            chain={baseMainnet}
          >
            {children}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
