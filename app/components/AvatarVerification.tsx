'use client';

import { Avatar } from '@coinbase/onchainkit/identity';
import { useState } from 'react';
import { base } from 'viem/chains';

interface AvatarVerificationProps {
  address: `0x${string}`;
  onConfirm: () => void;
  onDeny: () => void;
}

export default function AvatarVerification({ address, onConfirm, onDeny }: AvatarVerificationProps) {
  const [verified, setVerified] = useState(false);

  const handleYes = () => {
    setVerified(true);
    onConfirm();
  };

  const handleNo = () => {
    onDeny();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-4">Is this you?</h2>
      <div className="w-32 h-32 rounded-full overflow-hidden">
        <Avatar
          address={address}
          chain={base}
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
      <div className="flex gap-4">
        <button
          onClick={handleYes}
          disabled={verified}
          className={`px-4 py-2 text-white rounded transition-colors ${
            verified
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
          aria-label="Confirm this is your avatar"
        >
          Yes
        </button>
        <button
          onClick={handleNo}
          disabled={verified}
          className={`px-4 py-2 text-white rounded transition-colors ${
            verified
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          aria-label="Deny this is your avatar"
        >
          No
        </button>
      </div>
    </div>
  );
}
