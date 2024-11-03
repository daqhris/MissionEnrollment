import React, { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'viem/chains';

interface NetworkSwitchButtonProps {
  className?: string;
  onError?: (error: Error) => void;
}

const BASE_SEPOLIA_CHAIN_ID = 84532;

const NetworkSwitchButton = ({ className = '', onError }: NetworkSwitchButtonProps): JSX.Element => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNetworkSwitch = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID });
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      const errorMessage = error.code === 4902
        ? 'Base Sepolia network not configured in wallet. Please add Base Sepolia first.'
        : 'Failed to switch network. Please try again.';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (chainId === BASE_SEPOLIA_CHAIN_ID) {
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
