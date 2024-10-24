'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Mission Enrollment</h1>
          <div className="bg-base-100 p-6 rounded-lg shadow-lg">
            <p className="mb-4">
              Welcome to Mission Enrollment! Connect your wallet to get started.
            </p>
            {address && (
              <p className="text-success">
                Connected with: {address}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
