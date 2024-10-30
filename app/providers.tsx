import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ENV } from './config/env';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider apiKey={ENV.NEXT_PUBLIC_CDP_API_KEY}>
      {children}
    </OnchainKitProvider>
  );
}