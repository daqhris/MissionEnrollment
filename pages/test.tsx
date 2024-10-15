import React from 'react';
import { createConfig, WagmiConfig } from 'wagmi';
import { http } from 'viem';
import { gnosis } from 'wagmi/chains';
import EventAttendanceVerification from '../components/EventAttendanceVerification';
import ErrorBoundary from '../components/ErrorBoundary';

const config = createConfig({
  chains: [gnosis],
  transports: {
    [gnosis.id]: http(),
  },
});

const TestPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <WagmiConfig config={config}>
        <div>
          <h1>Test Page</h1>
          <EventAttendanceVerification
            walletAddress="0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82"
            poapId="7169394"
          />
        </div>
      </WagmiConfig>
    </ErrorBoundary>
  );
};

export default TestPage;
