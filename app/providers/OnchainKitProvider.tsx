import {
  createConfig,
  http,
  OnchainProvider,
  ConnectButton,
} from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { baseMainnet, baseSepolia, supportedChains } from '../config/chains';

interface OnchainKitProviderProps {
  children: ReactNode;
}

// Create OnchainKit configuration
const config = createConfig({
  chains: supportedChains,
  transports: {
    [baseMainnet.id]: http(baseMainnet.rpcUrls.default.http[0]),
    [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0]),
  },
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  ssr: true,
  // Use environment variables for configuration
  defaultChainId: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8453'),
});

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  return (
    <OnchainProvider config={config}>
      {children}
    </OnchainProvider>
  );
}

// Export connect button for easy access
export { ConnectButton };

export default OnchainKitProvider;
