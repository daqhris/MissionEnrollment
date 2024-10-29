import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { type Chain } from 'viem';
import { baseMainnet } from '../config/chains';
import { ENV, checkRequiredEnvVars } from '../config/env';
import { logger } from '../utils/logger';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  try {
    checkRequiredEnvVars();
  } catch (error) {
    logger.error('OnchainKitProvider', 'Environment check failed', error);
    throw error;
  }

  // Use Base Mainnet as the default chain
  const chain: Chain = baseMainnet as Chain;

  return (
    <BaseOnchainKitProvider
      chain={chain}
      projectId={ENV.WALLET_CONNECT_PROJECT_ID}
      apiKey={ENV.CDP_API_KEY}
      config={{
        appearance: {
          mode: 'light'
        }
      }}
    >
      {children}
    </BaseOnchainKitProvider>
  );
}
