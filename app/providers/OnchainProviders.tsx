'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import wagmiConfig from '../config/wagmi';
import { baseMainnet } from '../config/chains';
import { logger } from '../utils/logger';

export default function OnchainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    logger.warn('OnchainProviders', 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined');
  }

  if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
    logger.warn('OnchainProviders', 'NEXT_PUBLIC_CDP_API_KEY is not defined');
  }

  if (wagmiConfig.hasError || !wagmiConfig.isValid) {
    logger.warn('OnchainProviders', 'Wagmi configuration initialized with errors', wagmiConfig.error);
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
        chain={baseMainnet}
        projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
        apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
