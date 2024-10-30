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

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Initialize Sentry inside the component to ensure proper initialization order
export default function Providers({ children }: ProvidersProps): JSX.Element {
  logger.info('Providers', 'Component rendering started');

  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initializationStage, setInitializationStage] = useState<string>('starting');
  const [providersReady, setProvidersReady] = useState({
    sentry: false,
    wagmi: false,
    query: false,
    onchain: false
  });

  // Check if we're on client side
  const isClient = typeof window !== 'undefined';

  // Detect client-side hydration first
  useEffect(() => {
    if (isClient) {
      setHydrated(true);
      logger.info('Providers', 'Hydration detected');
      setInitializationStage('hydration_complete');
    }
  }, [isClient]);

  // Initialize environment variables and providers after hydration
  useEffect(() => {
    if (!hydrated) return;

    const initializeProviders = async () => {
      try {
        logger.info('Providers', 'Starting initialization sequence');

        // Validate environment variables
        try {
          checkRequiredEnvVars();
          logger.info('Providers', 'Environment variables validated');
          setInitializationStage('env_check_passed');
        } catch (envError) {
          throw new Error(`Environment validation failed: ${envError instanceof Error ? envError.message : 'Unknown error'}`);
        }

        // Initialize Sentry
        try {
          initSentry();
          setProvidersReady(prev => ({ ...prev, sentry: true }));
          logger.info('Providers', 'Sentry initialized successfully');
          setInitializationStage('sentry_initialized');
        } catch (sentryError) {
          throw new Error(`Sentry initialization failed: ${sentryError instanceof Error ? sentryError.message : 'Unknown error'}`);
        }

        // Initialize WagmiProvider
        if (!wagmiConfig.config || !wagmiConfig.isValid) {
          throw new Error('Invalid wagmi configuration');
        }
        setProvidersReady(prev => ({ ...prev, wagmi: true }));

        // Initialize QueryClient
        if (!queryClient) {
          throw new Error('QueryClient initialization failed');
        }
        setProvidersReady(prev => ({ ...prev, query: true }));

        // Validate OnchainKit environment variables
        const cdpApiKey = ENV.CDP_API_KEY;
        const projectId = ENV.WALLET_CONNECT_PROJECT_ID;

        if (!cdpApiKey || !projectId) {
          throw new Error(`Missing required OnchainKit configuration: ${!cdpApiKey ? 'CDP_API_KEY' : ''} ${!projectId ? 'WALLET_CONNECT_PROJECT_ID' : ''}`);
        }
        setProvidersReady(prev => ({ ...prev, onchain: true }));

        setInitializationStage('initialization_complete');
        setMounted(true);
        logger.info('Providers', 'All providers initialized successfully');
      } catch (err) {
        const errorToSet = err instanceof Error ? err : new Error('Provider initialization failed');
        captureException(errorToSet);
        logger.error('Providers', 'Provider initialization failed', {
          error: errorToSet,
          stage: initializationStage,
          providersStatus: providersReady,
          isClient,
          hydrated
        });
        setError(errorToSet);
      }
    };

    initializeProviders();
  }, [hydrated]);

  // Show loading state during server-side rendering or hydration
  if (!isClient || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white">
          <div className="text-lg font-semibold mb-2 text-gray-700">
            Loading
          </div>
          <div className="text-sm text-gray-500">
            Initializing application...
          </div>
        </div>
      </div>
    );
  }

  // Show error or loading state during initialization
  if (!mounted || error) {
    const message = error ? error.message : `Initializing providers (${initializationStage})...`;
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
              Stage: {initializationStage}
              <br />
              Providers Status: {Object.entries(providersReady)
                .map(([key, value]) => `${key}: ${value ? '✓' : '✗'}`)
                .join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  }

  logger.info('Providers', 'Rendering provider chain', {
    stage: 'render',
    hasWagmiConfig: !!wagmiConfig.config,
    hasQueryClient: !!queryClient,
    chain: baseMainnet.name,
    providersStatus: providersReady,
    isClient,
    hydrated
  });

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setError(null);
        setMounted(false);
        setInitializationStage('restarting');
        setProvidersReady({
          sentry: false,
          wagmi: false,
          query: false,
          onchain: false
        });
      }}
    >
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
    </ErrorBoundary>
  );
}
