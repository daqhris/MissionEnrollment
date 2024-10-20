import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const MinimalWalletConnect: React.FC = (): React.ReactElement => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async (): Promise<void> => {
    try {
      const connector = connectors.find((c) => c.id === 'injected') || injected();
      if (connector) {
        await connect({ connector });
      } else {
        console.error('No injected connector available');
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  return (
    <div>
      <h2>Minimal Wallet Connect</h2>
      {isConnected ? (
        <>
          <p>Connected Account: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default MinimalWalletConnect;
