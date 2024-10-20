import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const MinimalWagmiTest: React.FC = () => {
  const { connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connectAsync({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div>
      <h1>Minimal Wagmi Test</h1>
      {isConnected ? (
        <>
          <p>Connected to {address}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default MinimalWagmiTest;
