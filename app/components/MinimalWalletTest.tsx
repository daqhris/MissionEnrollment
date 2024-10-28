'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/wagmi';
import { onchainKitConfig } from '../config/onchainkit';

export default function MinimalWalletTest() {
  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider {...onchainKitConfig}>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <ConnectWallet />
        </div>
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
