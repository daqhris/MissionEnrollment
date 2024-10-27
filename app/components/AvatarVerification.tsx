'use client';

import { Avatar } from '@coinbase/onchainkit';
import { useState } from 'react';

interface AvatarVerificationProps {
  address: string;
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
      <div className="w-32 h-32">
        <Avatar address={address} />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleYes}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={handleNo}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
}
