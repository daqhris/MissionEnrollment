import { ConnectWallet } from '@coinbase/onchainkit/wallet';
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
    address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
    chainId: 8453,
    decimals: 18,
    image: "https://makerdao.com/images/logo.svg",
    name: "Dai",
    symbol: "DAI"
  };

  return (
    <div className={`flex flex-col gap-4 p-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex" data-testid="ockConnectWallet_Container">
          <ConnectWallet />
        </div>
      </div>

      {address && (
        <>
          <div className="flex items-center gap-2">
            <Avatar address={address} />
            <span className="text-sm">{address}</span>
          </div>
          <TokenRow token={token} />
        </>
      )}
    </div>
  );
};
