import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAccount, useChainId, usePublicClient, useSignMessage } from 'wagmi';
import { getEnsName } from '@/utils/ens';
import { getBaseName } from '@/utils/basename';
import { getTargetNetworks, ChainWithAttributes } from '@/utils/scaffold-eth/networks';
import { recoverMessageAddress } from 'viem';

// Import chain IDs
import { optimismSepolia, baseSepolia } from 'viem/chains';

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }): React.ReactElement => {
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [resolvedName, setResolvedName] = useState<string>('');
  const [network, setNetwork] = useState<ChainWithAttributes | null>(null);
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  useEffect(() => {
    if (chainId) {
      const targetNetworks = getTargetNetworks();
      const currentNetwork = targetNetworks.find(n => n.id === chainId);
      setNetwork(currentNetwork || null);
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
      <button onClick={handleVerify}>Verify Identity</button>
      {resolvedName && <p>Resolved Name: {resolvedName}</p>}
    </div>
  );
};

export default IdentityVerification;
