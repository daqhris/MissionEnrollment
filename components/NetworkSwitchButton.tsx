import React, { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS, baseSepolia } from '../app/config/wagmi';

interface NetworkSwitchButtonProps {
  className?: string;
  onError?: (error: Error) => void;
  targetChainId: number;
}

const NetworkSwitchButton = ({ className = '', onError, targetChainId }: NetworkSwitchButtonProps): JSX.Element => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNetworkSwitch = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await switchChain({ chainId: targetChainId });
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      const errorMessage = error.message || 'Failed to switch network. Please try again.';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (chainId === targetChainId) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-green-500">Connected to Base Sepolia</span>
        </div>
        <span className="text-xs text-gray-500">Ready to create attestation</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleNetworkSwitch}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        type="button"
        disabled={isLoading}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
        <span>{isLoading ? 'Switching...' : 'Switch to Base Sepolia'}</span>
      </button>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
      <span className="text-xs text-gray-500">Required for creating attestation</span>
    </div>
  );
};

export default NetworkSwitchButton;
