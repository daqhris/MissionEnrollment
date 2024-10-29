'use client';

import React, { useState, useEffect } from 'react';
import { Avatar } from '@coinbase/onchainkit/identity';
import { onchainKitConfig } from '../config/onchainkit';
import { useAccount } from 'wagmi';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface AvatarShowcaseProps {
  className?: string;
  onVerificationChange?: (isVerified: boolean) => void;
}

const AvatarShowcase: React.FC<AvatarShowcaseProps> = ({
  className = '',
  onVerificationChange
}) => {
  const { address, isConnected } = useAccount();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (onVerificationChange) {
      onVerificationChange(!!isVerified);
    }
  }, [isVerified, onVerificationChange]);

  if (!isConnected || !address) {
    return (
      <div className={`w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Connect Wallet</span>
      </div>
    );
  }

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
          <Avatar
            address={address}
            chain={onchainKitConfig.chain}
            className="w-full h-full"
            defaultComponent={
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Avatar</span>
              </div>
            }
            loadingComponent={
              <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            }
          />
        </div>
        {isVerified !== null && (
          <div className="absolute -bottom-2 -right-2">
            {isVerified ? (
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-500" />
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600">
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleVerification(true)}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Verify
        </button>
        <button
          onClick={() => handleVerification(false)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Deny
        </button>
      </div>
    </div>
  );
};

export default AvatarShowcase;
