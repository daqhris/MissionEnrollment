'use client';

import React, { useState, useEffect } from 'react';
import { Avatar } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { getName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { RainbowKitCustomConnectButton } from '../components/scaffold-eth';


export default function Home() {
  const { address, isConnected } = useAccount();
  const [inputName, setInputName] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [onchainName, setOnchainName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Home component mounted');
    console.log('Wallet connection status:', isConnected);
    console.log('Wallet address:', address);

    const fetchOnchainName = async () => {
      if (address) {
        try {
          console.log('Fetching onchain name for address:', address);
          const name = await getName({
            address: address,
            chain: base
          });
          console.log('Fetched onchain name:', name);
          setOnchainName(name);
          setError(null);
        } catch (error) {
          console.error('Error fetching onchain name:', error);
          setError('Failed to fetch onchain name. Please try again.');
          setOnchainName(null);
        }
      }
    };

    if (isConnected) {
      fetchOnchainName();
    } else {
      setOnchainName(null);
      setError(null);
    }

    return () => {
      console.log('Home component unmounting');
    };
  }, [address, isConnected]);

  const handleNameSubmit = async () => {
    try {
      const fullName = `${inputName.trim()}.base.eth`;
      console.log('Handling name submission:', fullName);
      console.log('Current onchain name:', onchainName);

      if (!inputName.trim()) {
        console.log('Empty input name detected');
        setVerificationStatus('error');
        setError('Please enter a name');
        return;
      }

      if (onchainName && fullName.toLowerCase() === onchainName.toLowerCase()) {
        console.log('Name verification successful');
        setVerificationStatus('success');
        setVerifiedName(fullName);
        setError(null);
      } else {
        console.log('Name verification failed');
        setVerificationStatus('error');
        setError('The provided name does not match your onchain basename identity');
      }
    } catch (error) {
      console.error('Error during name verification:', error);
      setVerificationStatus('error');
      setError('An unexpected error occurred during verification');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Mission Enrollment</h1>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="card">
            <div className="card-body">
              {!isConnected && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Start Registration</h2>
                  <p className="text-base-content/70 text-center mb-8">
                    Please connect your wallet to start enrolling for the mission
                  </p>
                  <div className="flex justify-center">
                    <RainbowKitCustomConnectButton />
                  </div>
                </>
              )}

              {isConnected && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Identity Check</h2>

                  {address && (
                    <div className="flex items-center gap-2 mb-6">
                      <Avatar address={address} />
                      <span className="text-sm">{address}</span>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-error mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <h3 className="card-title mb-4">What is your name on the blockchain?</h3>
                  <p className="text-sm mb-4">Please submit your public name as recorded onchain.</p>

                  <div className="flex items-center w-full max-w-md mb-4">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered flex-grow"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                    />
                    <span className="ml-2 text-base-content/70">.base.eth</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleNameSubmit}
                  >
                    REPLY
                  </button>

                  {verificationStatus === 'success' && (
                    <div className="alert alert-success mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Name verified successfully!</span>
                    </div>
                  )}

                  <button
                    className={`btn ${verificationStatus === 'success' ? 'btn-secondary' : 'btn-disabled'} mt-4`}
                    disabled={verificationStatus !== 'success'}
                  >
                    NEXT
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
