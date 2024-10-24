'use client';

import React from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { useWagmiConfig } from '../config/wagmi';

export default function OnchainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = useWagmiConfig();

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
