```typescript
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { NEXT_PUBLIC_WC_PROJECT_ID } from './env';

// Configure wallet groups with Coinbase Smart Wallet as a recommended option
export const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      coinbaseWallet({ projectId: NEXT_PUBLIC_WC_PROJECT_ID, appName: 'Mission Enrollment' }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet(),
      metaMaskWallet({ projectId: NEXT_PUBLIC_WC_PROJECT_ID }),
      walletConnectWallet({ projectId: NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
  },
]);
```
