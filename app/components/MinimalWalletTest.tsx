'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { logger } from '../utils/logger';
import { WalletErrorBoundary } from './WalletErrorBoundary';
import { useEffect, useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import wagmiConfig from '../config/wagmi';

function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="animate-pulse text-gray-600">
        Loading wallet connection...
      </div>
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-red-600">
        Failed to initialize wallet connection: {error.message}
      </div>
    </div>
  );
}

function ConfigurationError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-red-600">
        Configuration Error: {message}
      </div>
    </div>
  );
}

export default function MinimalWalletTest() {
  const [isReady, setIsReady] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    logger.info('MinimalWalletTest', 'Component mounted');
    try {
      // Verify environment variables and dependencies
      if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
        throw new Error('CDP API key is not configured');
      }
      if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
        throw new Error('WalletConnect Project ID is not configured');
      }

      // Check wagmi configuration
      if (wagmiConfig.hasError || !wagmiConfig.config) {
        logger.error('MinimalWalletTest', 'Wagmi configuration error', wagmiConfig.error);
        setConfigError(wagmiConfig.error?.message || 'Invalid wallet configuration');
        return;
      }

      logger.info('MinimalWalletTest', 'Environment and configuration check passed');
      setIsReady(true);
    } catch (error) {
      logger.error('MinimalWalletTest', 'Initialization failed', error);
      setConfigError(error instanceof Error ? error.message : 'Unknown initialization error');
    }

    return () => {
      logger.info('MinimalWalletTest', 'Component unmounted');
    };
  }, []);

  logger.info('MinimalWalletTest', 'Rendering component');

  if (configError) {
    return <ConfigurationError message={configError} />;
  }

  if (!isReady) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WalletErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <div className="flex min-h-screen flex-col items-center justify-center">
            <ConnectWallet />
          </div>
        </Suspense>
      </WalletErrorBoundary>
    </ErrorBoundary>
  );
}
