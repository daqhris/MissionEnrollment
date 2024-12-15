'use client';

import { useState, useEffect } from 'react';
import { type Chain } from 'viem';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { Avatar, getName } from '@coinbase/onchainkit/identity';
import { RainbowKitCustomConnectButton } from '../components/scaffold-eth';
import EventAttendanceVerification from '../components/EventAttendanceVerification';
import EnrollmentAttestation from '../components/EnrollmentAttestation';
import { SuccessAttestation } from '../components/SuccessAttestation';
import { Logo } from '../components/Logo';

// Type definitions for component state
interface EventInfo {
  role: string;
  date: string;
  venue: string;
  verifiedName: string;
  tokenId: string;
}

// Type for verification status
type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

interface POAPEventInfo {
  verifiedName: string;
  tokenId: string;
  role: string;
  date: string;
  venue: string;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [inputName, setInputName] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [onchainName, setOnchainName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEventAttendance, setShowEventAttendance] = useState(false);
  const [showAttestation, setShowAttestation] = useState(false);
  const [eventAttendanceVerified, setEventAttendanceVerified] = useState(false);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [eventInfo, setEventInfo] = useState<{
    role: string;
    date: string;
    venue: string;
    verifiedName: string;
    tokenId: string;
  } | null>(null);

  useEffect(() => {
    console.log('Home component mounted');
    console.log('Wallet connection status:', isConnected);
    console.log('Wallet address:', address);

    const fetchOnchainName = async () => {
      if (!address) return;

      try {
        console.log('Fetching onchain name for address:', address);
        // Ensure we're using Base mainnet for initial user experience
        console.log('Using Base mainnet for name verification:', base);
        // Cast base chain to match getName's expected type signature
        const name = await getName({
          address: address,
          chain: base as any // Temporarily use any to bridge the two viem versions
        });
        console.log('Fetched onchain name:', name);
        setOnchainName(name);
        setError(null);
      } catch (err) {
        console.error('Error fetching onchain name:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch onchain name');
        setOnchainName(null);
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
        setError('The provided name does not match your onchain identity');
      }
    } catch (error) {
      console.error('Error during name verification:', error);
      setVerificationStatus('error');
      setError('An unexpected error occurred during verification');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <Logo />
      </div>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="card">
            <div className="card-body">
              {!isConnected && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#957777]">Start Registration</h2>
                  <div className="space-y-4 mb-8">
                    <p className="text-base-content/70 text-center">
                      An enrollment tool for a collaborative artistic mission on the BASE blockchain.
                    </p>
                    <p className="text-base-content/70 text-center"><em>Openly built by a human and a non-human since summer 2024.</em></p>
                  </div>
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
                    className={`btn btn-primary ${attestationId ? 'btn-disabled opacity-50' : ''}`}
                    onClick={handleNameSubmit}
                    disabled={!!attestationId}
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

                  {verificationStatus === 'success' && !showEventAttendance && (
                    <button
                      className={`btn btn-secondary mt-4 ${attestationId ? 'btn-disabled opacity-50' : ''}`}
                      onClick={() => setShowEventAttendance(true)}
                      disabled={!!attestationId}
                    >
                      NEXT
                    </button>
                  )}

                  {showEventAttendance && verifiedName && (
                    <div>
                      <EventAttendanceVerification
                        address={address || ''}
                        verifiedName={verifiedName}
                        attestationId={attestationId}
                        onVerified={(hasAttended: boolean, info?: {
                          role: string;
                          date: string;
                          venue: string;
                          verifiedName: string;
                          tokenId: string;
                        }) => {
                          setEventAttendanceVerified(hasAttended);
                          if (info) {
                            setEventInfo(info);
                            setShowAttestation(true);
                          }
                        }}
                      />
                    </div>
                  )}

                  {showAttestation && eventInfo && (
                    <div className="mt-4">
                      <EnrollmentAttestation
                        verifiedName={eventInfo.verifiedName}
                        poapVerified={eventAttendanceVerified}
                        onAttestationComplete={(attestationId: string) => {
                          console.log('Attestation created:', attestationId);
                          setAttestationId(attestationId);
                          setShowAttestation(false);
                        }}
                      />
                    </div>
                  )}

                  {attestationId && eventInfo && (
                    <SuccessAttestation
                      attestationId={attestationId}
                      verifiedName={eventInfo.verifiedName}
                      role={eventInfo.role}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
