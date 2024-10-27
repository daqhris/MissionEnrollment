'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useEnsAddress } from 'wagmi';
import { type Address } from 'viem';
import '@coinbase/onchainkit/styles.css';

export default function Home(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [nameVerified, setNameVerified] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  // Move ENS hooks to component level
  const { data: baseNameAddress, isError: baseNameError } = useEnsAddress({
    name: name ? `${name}.base.eth` : undefined,
    chainId: 8453,
    query: {
      enabled: !!name && !name.includes('.')
    }
  });

  const { data: ensAddress, isError: ensError } = useEnsAddress({
    name: name ? `${name}.eth` : undefined,
    chainId: 1,
    query: {
      enabled: !!name && !name.includes('.')
    }
  });

  // Effect to handle verification when addresses change
  useEffect(() => {
    if (!name || !address || name.includes('.')) return;

    const cleanName = name.toLowerCase();
    const connectedAddress = (address as Address).toLowerCase();

    if (baseNameAddress && baseNameAddress.toLowerCase() === connectedAddress) {
      setNameVerified(true);
      setVerificationError('');
    } else if (ensAddress && ensAddress.toLowerCase() === connectedAddress) {
      setNameVerified(true);
      setVerificationError('');
    } else if (baseNameError && ensError) {
      setNameVerified(false);
      setVerificationError('The provided name does not match your onchain identity');
    }
  }, [name, address, baseNameAddress, ensAddress, baseNameError, ensError]);

  const verifyName = async () => {
    if (!name || !address) return;

    setIsVerifying(true);
    setVerificationError('');

    try {
      // Check for invalid characters
      const validNameRegex = /^[a-z0-9-]+$/;
      if (!validNameRegex.test(name)) {
        setVerificationError('Name can only contain lowercase letters, numbers, and hyphens');
        return;
      }

      if (name.includes('.')) {
        setVerificationError('Please enter your name without .eth or .base.eth');
        return;
      }

      // Verification is handled by the useEffect hook
    } catch (error) {
      setVerificationError('Error verifying name. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Image
            src="/logo.png"
            alt="Mission Enrollment Logo"
            width={32}
            height={32}
            priority
          />
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Base
            </span>
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-8">
            What is your name on the blockchain?
          </h1>

          {/* Connect Wallet Button (Centered) */}
          {!isConnected && (
            <div className="flex justify-center mb-8">
              <ConnectWallet />
            </div>
          )}

          {/* Name Input Form */}
          {isConnected && (
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Enter your name"
                disabled={nameVerified}
              />

              {verificationError && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4">{verificationError}</div>
              )}

              {nameVerified && (
                <div className="text-green-500 text-sm bg-green-50 p-2 rounded mb-4">Name verified successfully!</div>
              )}

              <div className="flex justify-between space-x-4">
                <button
                  onClick={verifyName}
                  disabled={!name || nameVerified || isVerifying}
                  className={`flex-1 py-2 px-4 rounded font-medium ${
                    nameVerified || !name
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
                  } text-gray-700 transition-colors`}
                >
                  {isVerifying ? 'Verifying...' : 'REPLY'}
                </button>

                <button
                  disabled={!nameVerified}
                  className={`flex-1 py-2 px-4 rounded font-medium ${
                    nameVerified
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white transition-colors`}
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
