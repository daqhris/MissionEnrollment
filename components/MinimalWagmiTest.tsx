import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/core/connectors/injected';

const MinimalWagmiTest: React.FC = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <h1>Minimal Wagmi Test</h1>
      {isConnected ? (
        <>
          <p>Connected to {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  );
};

export default MinimalWagmiTest;
