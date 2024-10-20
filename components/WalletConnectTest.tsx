import React, { useState } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';

const WalletConnectTest: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (): Promise<void> => {
    try {
      await connect({ connector: injected() });
      setError(null);
    } catch (err) {
      setError('Failed to connect wallet: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div>
      <h2>Minimal Wallet Connect Test</h2>
      {isConnected ? (
        <div>
          <p>Connected to: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WalletConnectTest;
