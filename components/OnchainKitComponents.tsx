import { Avatar } from '@coinbase/onchainkit/identity';
import { TokenRow } from '@coinbase/onchainkit/token';
import { useAccount } from 'wagmi';
import React from 'react';

interface OnchainKitComponentsProps {
  className?: string;
}

export const OnchainKitComponents: React.FC<OnchainKitComponentsProps> = ({ className }) => {
  const { address } = useAccount();

  // Example token data (we'll update this based on actual requirements)
  const token = {
    address: process.env.NEXT_PUBLIC_DAI_TOKEN_ADDRESS || '',
    chainId: 8453,
    decimals: 18,
    image: "https://makerdao.com/images/logo.svg",
    name: "Dai",
    symbol: "DAI"
  };

  if (!address) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-4 p-4 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Avatar address={address} />
        <span className="text-sm">{address}</span>
      </div>
      <TokenRow token={token} />
    </div>
  );
};
