import React from 'react';

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }): React.ReactElement => {
  console.log('IdentityVerification component rendered');

  const handleVerifyClick = (): void => {
    const sampleAddress = '0x1234567890123456789012345678901234567890';
    const sampleName = 'John Doe';
    onVerified(sampleAddress, sampleName);
  };

  return (
    <div>
      <h2>Identity Verification</h2>
      <p>This is a simplified version of the IdentityVerification component.</p>
      <button onClick={handleVerifyClick}>Verify Identity</button>
    </div>
  );
};

export default IdentityVerification;
