'use client';

import React from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import '@coinbase/onchainkit/styles.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

  if (!onchainKitApiKey) {
    throw new Error('NEXT_PUBLIC_ONCHAINKIT_API_KEY is required');
  }

  return (
    <WagmiConfig config={config}>
      <OnchainKitProvider
        apiKey={onchainKitApiKey}
        mode="light"
      >
        {children}
      </OnchainKitProvider>
    </WagmiConfig>
  );
}
