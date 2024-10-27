import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import React from 'react';

interface OnchainKitComponentsProps {
  className?: string;
}

export const OnchainKitComponents: React.FC<OnchainKitComponentsProps> = ({ className }) => {
  const { address } = useAccount();

  return (
    <div className={`flex flex-col gap-4 p-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <ConnectWallet />
      </div>

      {address && (
        <>
          <div className="flex items-center gap-2">
            <Avatar address={address} />
            <span className="text-sm">{address}</span>
          </div>
        </>
      )}
    </div>
  );
};
