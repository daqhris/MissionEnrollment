import React, { useState, useEffect, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import { AlchemyProvider } from '@ethersproject/providers';

interface IdentityVerificationProps {
  onVerified: (username: string, address: string, resolvedName: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }) => {
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [resolvedName, setResolvedName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    detectNetwork();
  }, []);

  const detectNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.name === 'optimism' || network.name === 'optimism-sepolia') {
          setNetwork('optimism');
        } else if (network.name === 'base' || network.name === 'base-sepolia') {
          setNetwork('base');
        } else {
          setNetwork(network.name);
        }
      } catch (error) {
        console.error('Error detecting network:', error);
        setError('Failed to detect network');
      }
    } else {
      setError('No Ethereum provider detected');
    }
  };

  const retrieveName = async (address: string): Promise<string> => {
    if (network === 'base' || network === 'base-sepolia') {
      return `Basename-${address.slice(0, 6)}...${address.slice(-4)}`;
    } else {
      try {
        const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';
        const provider = new AlchemyProvider('mainnet', alchemyApiKey);
        const name = await provider.lookupAddress(address);
        return name || address;
      } catch (error) {
        console.error('Error retrieving ENS name:', error);
        return address;
      }
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');
    setResolvedName('');

    try {
      if (!username.trim()) {
        throw new Error('Username is required');
      }
      if (!ethers.utils.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const name = await retrieveName(address);
      setResolvedName(name);
      onVerified(username, address, name);
    } catch (error) {
      console.error('Verification error:', error);
      setError((error as Error).message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h2>Identity Verification</h2>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
      />
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter Ethereum address"
      />
      <button onClick={handleVerify} disabled={isVerifying || !username || !address}>
        {isVerifying ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {resolvedName && <p>Resolved Name: {resolvedName}</p>}
      {network && <p>Connected Network: {network}</p>}
    </div>
  );
};

export default IdentityVerification;
