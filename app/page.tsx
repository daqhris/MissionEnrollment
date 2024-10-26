'use client';

import React, { useState } from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const [inputName, setInputName] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  const handleNameSubmit = () => {
    // Temporary mock verification - will add real verification later
    if (inputName.trim()) {
      setVerificationStatus('success');
      setVerifiedName(inputName);
    } else {
      setVerificationStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Mission Enrollment</h1>
          <div className="bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">What is your identity on the blockchain?</h2>
                  <p className="text-sm mb-4">Please provide your public name as recorded on-chain.</p>

                  <input
                    type="text"
                    placeholder="Enter your on-chain name"
                    className="input input-bordered w-full max-w-md mb-4"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                  />

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

                  {verificationStatus === 'error' && (
                    <div className="alert alert-error mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>The provided name does not match your on-chain identity. Please check and try again.</span>
                    </div>
                  )}

                  <button
                    className={`btn ${verificationStatus === 'success' ? 'btn-secondary' : 'btn-disabled'} mt-4`}
                    disabled={verificationStatus !== 'success'}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
