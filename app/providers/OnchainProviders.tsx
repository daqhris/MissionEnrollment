'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import wagmiConfig from '../config/wagmi';
import { onchainKitConfig } from '../config/onchainkit';
import { logger } from '../utils/logger';
import { ENV, checkRequiredEnvVars } from '../config/env';

export default function OnchainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    checkRequiredEnvVars();
  } catch (error) {
    logger.error('OnchainProviders', 'Environment check failed', error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-red-600">
          Failed to initialize providers. Please check your environment configuration.
        </div>
      </div>
    );
  }

  if (wagmiConfig.hasError || !wagmiConfig.isValid) {
    logger.error('OnchainProviders', 'Wagmi configuration initialized with errors', wagmiConfig.error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-red-600">
          Failed to initialize wallet configuration. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig.config}>
      <OnchainKitProvider
        chain={onchainKitConfig.chain}
        projectId={ENV.WALLET_CONNECT_PROJECT_ID}
        apiKey={ENV.CDP_API_KEY}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
