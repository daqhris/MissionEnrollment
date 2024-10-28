'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ErrorBoundary } from 'react-error-boundary';
import { useAccount, useEnsName, usePublicClient, useEnsResolver } from 'wagmi';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import AvatarShowcase from './components/AvatarShowcase';
import WalletConnect from './components/WalletConnect';

export default function Home(): React.ReactElement {
  // Track if component is mounted
  const [mounted, setMounted] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const publicClient = usePublicClient();
  const ensResolver = useEnsResolver();

  // Set mounted state after initial render
  useEffect(() => {
    console.log('[Page] Component mounting...');
    setMounted(true);
    return () => {
      console.log('[Page] Component unmounting...');
    };
  }, []);

  const handleNameSubmit = async () => {
    if (!address || !publicClient) return;

    setIsVerifying(true);
    setVerificationError('');

    // First try with .base.eth
    const baseName = `${nameInput}.base.eth`;
    try {
      // Check if the input contains .base.eth or .eth
      if (nameInput.includes('.base.eth') || nameInput.includes('.eth')) {
        setVerificationError('Please enter only your name without any suffixes');
        setIsVerifying(false);
        return;
      }

      // Validate single word input
      if (nameInput.includes(' ')) {
        setVerificationError('Please enter a single word without spaces');
        setIsVerifying(false);
        return;
      }

      // Verify Base name
      const baseNameAddress = await publicClient.getEnsAddress({
        name: baseName,
      });

      if (baseNameAddress && baseNameAddress.toLowerCase() === address.toLowerCase()) {
        setIsVerified(true);
        setVerificationError('');
        setIsVerifying(false);
        return;
      }

      // If Base name check fails, try with .eth
      const ethName = `${nameInput}.eth`;
      const ethNameAddress = await publicClient.getEnsAddress({
        name: ethName,
      });

      if (ethNameAddress && ethNameAddress.toLowerCase() === address.toLowerCase()) {
        setIsVerified(true);
        setVerificationError('');
      } else {
        setVerificationError('The provided name does not match your onchain identity');
      }
    } catch (error) {
      console.error('Name verification error:', error);
      setVerificationError('Error verifying name. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<div className="p-4 text-red-600">Something went wrong. Please try again.</div>}
      onError={(error) => {
        console.error('[Page] Error in Home component:', {
          message: error.message,
          name: error.name
        });
      }}
    >
      <main className="min-h-screen bg-gray-50">
        {/* Logo */}
        <div className="absolute top-4 left-4">
          <Image
            src="/logo.png"
            alt="Mission Enrollment Logo"
            width={150}
            height={50}
            style={{
              width: '150px',
              height: '50px',
              objectFit: 'contain'
            }}
            priority
          />
        </div>

        {/* Main Content */}
        <div className="h-screen flex flex-col items-center justify-center px-4">
          {/* Network Name */}
          <div className="text-2xl font-bold mb-8">Base</div>

          {/* Connect Wallet Button */}
          <div className="flex justify-center w-full mb-8">
            <WalletConnect onConnect={(address) => {
              console.log('Wallet connected:', address);
            }} />
          </div>

          {/* Avatar Showcase */}
          {isConnected && (
            <div className="mb-8">
              <AvatarShowcase
                onVerificationChange={(verified) => {
                  setIsVerified(verified);
                  if (verified) {
                    setVerificationError('');
                  }
                }}
              />
            </div>
          )}

          {/* Name Verification Section */}
          {isConnected && (
            <div className="mt-8 w-full max-w-md">
              <h2 className="text-lg font-medium mb-4">
                What is your name on the blockchain?
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={isVerified}
                  placeholder="Enter your name"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleNameSubmit}
                  disabled={isVerified || !nameInput || isVerifying}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isVerified || !nameInput || isVerifying
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  REPLY
                </button>
              </div>

              {/* Verification Status */}
              {verificationError && (
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <XCircleIcon className="w-5 h-5" />
                  <span>{verificationError}</span>
                </div>
              )}

              {isVerified && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Name verified successfully!</span>
                  </div>
                  <div className="text-yellow-600">
                    Return home to bring a passport photo
                  </div>
                  <button
                    onClick={() => window.location.href = '/avatar-verification'}
                    className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}
