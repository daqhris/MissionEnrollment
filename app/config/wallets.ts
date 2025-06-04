
'use client';

import { isSmartAccountSupported } from './smartWallets';

if (typeof window !== 'undefined' && isSmartAccountSupported()) {
  console.log('Smart account support is available');
}

export { config as walletConfig } from './wagmi';
