import React from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { gnosis } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import EventAttendanceVerification from '../components/EventAttendanceVerification';

const publicClient = createPublicClient({
  chain: gnosis,
  transport: http()
});

const config = createConfig({
  autoConnect: true,
  publicClient,
});

const TestPOAPVerification: React.FC = () => {
  const testWalletAddress = "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82";

  return (
    <WagmiConfig config={config}>
      <div>
        <h1>Test POAP Verification</h1>
        <EventAttendanceVerification
          userAddress={testWalletAddress}
          onVerified={() => console.log("POAP verified!")}
        />
      </div>
    </WagmiConfig>
  );
};

export default TestPOAPVerification;
