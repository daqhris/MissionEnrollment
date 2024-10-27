'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [name, setName] = useState('');
  const [nameVerified, setNameVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock functions for testing UI
  const mockVerifyName = async () => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (name === 'test') {
      setNameVerified(true);
      setVerificationError('');
    } else {
      setVerificationError('The provided name does not match your onchain identity');
    }
    setIsVerifying(false);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto relative">
        {/* Logo */}
        <div className="absolute top-4 left-4">
          <Image
            src="/logo.png"
            alt="Mission Enrollment Logo"
            width={40}
            height={40}
            priority
          />
        </div>

        {/* Network Display (mocked) */}
        <div className="absolute top-4 right-4">
          <span className="text-xl font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Base
          </span>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold mb-8 text-center pt-16">Mission Enrollment</h1>

        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-lg text-gray-600">Connect your wallet to begin</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transform hover:scale-105 transition-transform duration-200">
            Connect Wallet
          </button>
        </div>

        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">What is your name on the blockchain?</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name (without .eth or .base.eth)"
              disabled={nameVerified}
            />

            <button
              onClick={mockVerifyName}
              disabled={!name || nameVerified || isVerifying}
              className={`w-full py-2 px-4 rounded font-medium ${
                nameVerified
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              } text-white transition-colors`}
            >
              {isVerifying ? 'Verifying...' : 'REPLY'}
            </button>

            {verificationError && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{verificationError}</div>
            )}

            {nameVerified && (
              <div className="text-green-500 text-sm bg-green-50 p-2 rounded">Name verified successfully!</div>
            )}

            <button
              disabled={!nameVerified}
              className={`w-full py-2 px-4 rounded font-medium ${
                nameVerified
                  ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white transition-colors`}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
