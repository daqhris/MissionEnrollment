
'use client';

import { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID } from './env';
import { isSmartAccountSupported } from './smartWallets';
import { config } from './wagmi';

if (typeof window !== 'undefined' && isSmartAccountSupported()) {
  console.log('Smart account support is available');
}

export { config as walletConfig } from './wagmi';
