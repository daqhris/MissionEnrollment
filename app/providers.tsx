'use client';

import React from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import { base } from 'viem/chains';
import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

  if (!onchainKitApiKey) {
    console.warn('NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set. Some features may be limited.');
  }

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={config.chains}>
        <OnchainKitProvider
          apiKey={onchainKitApiKey ?? ''}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
