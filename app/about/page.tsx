'use client';

import React, { useEffect, useState } from 'react';
import { ClientLayout } from '../../components/ClientLayout';

export default function AboutPage() {
  const [lastCommit, setLastCommit] = useState<{ date: string; sha: string } | null>(null);

  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/daqhris/MissionEnrollment/commits/main');
        const data = await response.json();
        setLastCommit({
          date: new Date(data.commit.author.date).toLocaleString(),
          sha: data.sha.substring(0, 7)
        });
      } catch (error) {
        console.error('Error fetching commit info:', error);
      }
    };
    fetchLastCommit();
    const interval = setInterval(fetchLastCommit, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-4xl font-bold mb-8">About Mission Enrollment</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>Mission Enrollment is a blockchain-based application that facilitates secure and verifiable enrollments through the power of Ethereum attestations. Built during ETHGlobal Brussels 2024, it enables participants to create permanent records of their commitments and achievements on the blockchain.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-6">
              <li>Create verifiable attestations on the Base blockchain</li>
              <li>Verify event participation through POAP tokens</li>
              <li>Connect with multiple wallet providers</li>
              <li>Preview and verify attestations before submission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mission</h2>
            <p>Inspired by the spirit of the Zinneke Parade in Brussels, Mission Enrollment aims to bridge the gap between real-world participation and blockchain verification, creating lasting records of community engagement and achievement.</p>
          </section>

          {lastCommit && (
            <div className="text-sm text-gray-600 mt-8">
              Last updated: {lastCommit.date} (commit: {lastCommit.sha})
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
