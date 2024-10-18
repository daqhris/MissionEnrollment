import React from 'react';
import IdentityVerification from '../components/IdentityVerification';

const TestWalletConnection: React.FC = (): React.ReactElement => {
  const handleVerified = (address: string, name: string): void => {
    console.log(`Verified: Address ${address}, Name ${name}`);
  };

  return (
    <div>
      <h1>Test Wallet Connection</h1>
      <IdentityVerification onVerified={handleVerified} />
    </div>
  );
};

export default TestWalletConnection;
