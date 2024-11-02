import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const MinimalWalletConnect: React.FC = (): React.ReactElement => {
  const { isConnected } = useAccount();
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
    <div className="fixed bottom-4 left-4 z-50">
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="btn btn-sm btn-secondary hover:bg-secondary-focus transition-colors duration-200"
          title="Disconnect wallet"
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={handleConnect}
          className="btn btn-sm btn-primary hover:bg-primary-focus transition-colors duration-200"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default MinimalWalletConnect;
