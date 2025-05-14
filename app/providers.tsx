'use client';

import React from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { OnboardingProvider } from './providers/OnboardingProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <OnboardingProvider>
          {children}
        </OnboardingProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
