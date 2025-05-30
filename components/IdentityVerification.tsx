import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useVerificationStore } from '../services/store/verificationStore';
import { verifyBaseName } from '../utils/basename';
import { verifyEnsName } from '../utils/ens';

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.error('IdentityVerification Error:', error);
  }

  override render() {
    if (this.state.hasError) {
      return <div className="alert alert-error">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }): React.ReactElement => {
  console.log('Initializing IdentityVerification component');

  // Safely access wallet connection
  const { address } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);

  const {
    userInput,
    isVerified,
    verifiedName,
    error,
    setUserInput,
    setVerificationStatus,
    setVerifiedName,
    setError,
  } = useVerificationStore();

  // Handle initial mounting and wallet connection
  useEffect((): (() => void) => {
    try {
      console.log('IdentityVerification mounted');
      console.log('Initial state:', {
        address,
        userInput,
        isVerified,
        verifiedName,
        error
      });

      setComponentMounted(true);

      if (!address) {
        console.log('No wallet connected');
        setError('Please connect your wallet to continue.');
      } else {
        console.log('Wallet connected:', address);
        setError(null);
      }

      return () => {
        console.log('IdentityVerification unmounting');
        setComponentMounted(false);
        console.log('Final state:', {
          address,
          userInput,
          isVerified,
          verifiedName,
          error
        });
      };
    } catch (err) {
      console.error('Error in component initialization:', err);
      setError('Failed to initialize component. Please refresh the page.');
      return () => undefined;
    }
  }, [address, userInput, isVerified, verifiedName, error, setError]);

  const handleVerification = async (): Promise<void> => {
    if (!componentMounted) {
      console.log('Verification cancelled - component not fully mounted');
      return;
    }

    if (!address || !userInput) {
      console.log('Verification cancelled - missing address or input:', { address, userInput });
      setError('Please provide your on-chain name.');
      return;
    }

    console.log('Starting verification for:', { address, userInput });
    setIsVerifying(true);
    setError(null);

    try {
      // First try Base name verification
      console.log('Attempting Base name verification');
      const isBaseVerified = await verifyBaseName(address, userInput);
      console.log('Base name verification result:', isBaseVerified);

      if (isBaseVerified) {
        console.log('Base name verification successful');
        setVerificationStatus(true);
        setVerifiedName(userInput);
        onVerified(address, userInput);
        return;
      }

      // If Base name verification fails, try ENS as fallback
      console.log('Base name verification failed, attempting ENS fallback');
      const isEnsVerified = await verifyEnsName(address, userInput);
      console.log('ENS verification result:', isEnsVerified);

      if (isEnsVerified) {
        console.log('ENS verification successful');
        setVerificationStatus(true);
        setVerifiedName(userInput);
        onVerified(address, userInput);
        return;
      }

      // If both verifications fail, show error
      console.log('All verifications failed');
      setVerificationStatus(false);
      setError('The provided name does not match your on-chain identity. Please check and try again.');

    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification. Please try again.');
      setVerificationStatus(false);
    } finally {
      if (componentMounted) {
        console.log('Verification process completed');
        setIsVerifying(false);
      }
    }
  };

  const handleNext = (): void => {
    if (!componentMounted) return;

    if (isVerified && verifiedName) {
      console.log('Proceeding to next step with:', { address, verifiedName });
      onVerified(address || '', verifiedName);
    } else {
      console.log('Cannot proceed - verification incomplete:', { isVerified, verifiedName });
    }
  };

  // Render loading state while component is initializing
  if (!componentMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">What is your identity?</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Please provide your public name as recorded on the blockchain.
            </p>

            <div className="form-control w-full">
              <input
                type="text"
                placeholder="Enter your on-chain name"
                className="input input-bordered w-full"
                value={userInput}
                onChange={(e) => {
                  console.log('Input changed:', e.target.value);
                  setUserInput(e.target.value);
                }}
                disabled={isVerifying}
              />
            </div>

            {error && (
              <div className="alert alert-error mt-4 text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {isVerified && (
              <div className="alert alert-success mt-4 text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Name verified successfully!</span>
              </div>
            )}

            <div className="card-actions flex-col sm:flex-row justify-center sm:justify-end mt-6 gap-2">
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleVerification}
                disabled={!userInput || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Verifying...
                  </>
                ) : (
                  'Reply'
                )}
              </button>

              <button
                className={`btn w-full sm:w-auto ${isVerified ? 'btn-secondary' : 'btn-disabled'}`}
                disabled={!isVerified}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
