'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import config from '../config/wagmi';
import { base } from 'viem/chains';

export default function OnchainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined');
  }

  if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
    throw new Error('NEXT_PUBLIC_CDP_API_KEY is not defined');
  }

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        chain={base}
        projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
        apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
