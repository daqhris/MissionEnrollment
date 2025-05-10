import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode, useState, useEffect } from 'react';
import { base, baseSepolia } from 'viem/chains';
import { type Chain } from 'viem';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useUserNetworkPreference } from '../../hooks/useUserNetworkPreference';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  const { preferredNetwork } = useUserNetworkPreference();
  
  // Get the default chain from environment or use Base Mainnet if no user preference
  const [defaultChain, setDefaultChain] = useState<number>(
    parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8453')
  );
  
  useEffect(() => {
    if (preferredNetwork) {
      setDefaultChain(preferredNetwork);
    }
  }, [preferredNetwork]);

  // Validate chain ID and select appropriate chain
  let chain: Chain;
  if (defaultChain === 84532) {
    chain = baseSepolia;
  } else if (defaultChain === 8453) {
    chain = base;
  } else {
    console.error('Invalid chain ID. Only Base Mainnet (8453) and Base Sepolia (84532) are supported.');
    return (
      <div className="text-red-500">
        Error: Invalid chain ID. Only Base Mainnet and Base Sepolia are supported.
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

  if (!apiKey) {
    console.warn('OnchainKit API key not found in environment variables');
    return (
      <div className="text-red-500">
        Error: OnchainKit API key is required. Please check your environment variables.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BaseOnchainKitProvider
        chain={chain}
        apiKey={apiKey}
        config={{
          appearance: {
            mode: 'light'
          }
        }}
      >
        {children}
      </BaseOnchainKitProvider>
    </ErrorBoundary>
  );
}
