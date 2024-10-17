import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAccount, useSignMessage, useConnect, useChainId } from 'wagmi';
import { getEnsName } from '@/utils/ens';
import { getBaseName } from '@/utils/basename';
import { getTargetNetworks, ChainWithAttributes } from '@/utils/scaffold-eth/networks';
import { recoverMessageAddress } from 'viem';
import { coinbaseWallet } from 'wagmi/connectors';

// Import chain IDs
import { optimismSepolia, baseSepolia } from 'viem/chains';

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [resolvedName, setResolvedName] = useState<string>('');
  const [network, setNetwork] = useState<ChainWithAttributes | undefined>(undefined);
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect();

  useEffect((): void => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  useEffect((): void => {
    if (chainId) {
      const targetNetworks = getTargetNetworks();
      let currentNetwork = targetNetworks.find(n => n.id === chainId);

      if (chainId === baseSepolia.id) {
        currentNetwork = { ...currentNetwork, name: 'Base Sepolia' } as ChainWithAttributes;
        console.log('Detected Base Sepolia testnet');
      } else if (chainId === optimismSepolia.id) {
        currentNetwork = { ...currentNetwork, name: 'Optimism Sepolia' } as ChainWithAttributes;
        console.log('Detected Optimism Sepolia testnet');
      }

      setNetwork(currentNetwork);
    } else {
      setNetwork(undefined);
    }
  }, [chainId]);

  const retrieveName = async (address: string): Promise<string> => {
    if (!network) return '';

    try {
      if (network.id === baseSepolia.id) {
        return await getBaseName(address);
      } else if (network.id === optimismSepolia.id) {
        return await getEnsName(address);
      } else {
        console.warn('Unsupported network for name resolution');
        return '';
      }
    } catch (error) {
      console.error('Error retrieving name:', error);
      return '';
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handleVerify = async (): Promise<void> => {
    if (!address) {
      console.error('No address connected');
      return;
    }

    try {
      const message = `Verify username: ${username}`;
      const signature = await signMessageAsync({ message });

      const recoveredAddress = await recoverMessageAddress({
        message,
        signature,
      });

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        const name = await retrieveName(address);
        setResolvedName(name);
        onVerified(address, name || username);
      } else {
        console.error('Signature verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  const connectCoinbaseWallet = async (): Promise<void> => {
    try {
      await connect({
        connector: coinbaseWallet({
          appName: 'Mission Enrollment',
        }),
      });
    } catch (error) {
      console.error('Error connecting to Coinbase Wallet:', error);
    }
  };

  return (
    <div>
      <h2>Identity Verification</h2>
      <input
        type="text"
        value={username}
        onChange={handleInputChange}
        placeholder="Enter username"
      />
      <p>Connected Address: {address}</p>
      <p>Network: {network ? network.name : 'Not connected'}</p>
      {!address && (
        <button onClick={connectCoinbaseWallet}>Connect Coinbase Wallet</button>
      )}
      <button onClick={handleVerify} disabled={!address}>Verify Identity</button>
      {resolvedName && <p>Resolved Name: {resolvedName}</p>}
    </div>
  );
};

export default IdentityVerification;
