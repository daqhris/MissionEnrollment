import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const MinimalWalletConnect: React.FC = (): React.ReactElement => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleConnect = async (): Promise<void> => {
    try {
      await connect();
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
