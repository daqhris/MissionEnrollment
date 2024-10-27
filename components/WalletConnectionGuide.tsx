import React from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

interface WalletConnectionGuideProps {
  theme: string;
}

const WalletConnectionGuide: React.FC<WalletConnectionGuideProps> = ({ theme }): JSX.Element => {
  return (
    <div className={`p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
      <div className="mt-6">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default WalletConnectionGuide;
