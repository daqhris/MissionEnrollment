import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }) => {
  console.log('IdentityVerification component rendered');

  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log('useEffect triggered. isConnected:', isConnected, 'address:', address);
    if (isConnected && address) {
      console.log('Wallet connected:', address);
    }
  }, [isConnected, address]);

  const handleConnect = async () => {
    console.log('Attempting to connect wallet');
    try {
      await connect();
      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    console.log('Disconnecting wallet');
    try {
      await disconnect();
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError('Failed to disconnect wallet. Please try again.');
    }
  };

  const handleVerify = () => {
    console.log('Verifying identity. Address:', address, 'Username:', username);
    if (isConnected && address) {
      onVerified(address, username);
    } else {
      setError('Please connect your wallet first.');
    }
  };

  return (
    <div>
      <h2>Identity Verification</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        disabled={!isConnected}
      />
      <p>Connected Address: {address || 'Not connected'}</p>
      {!isConnected ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <>
          <button onClick={handleVerify}>Verify Identity</button>
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
};

export default IdentityVerification;
