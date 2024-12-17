'use client';

import React, { useEffect, useState } from 'react';
import { ClientLayout } from '../../components/ClientLayout';
import type { ReactNode } from 'react';

interface CommitInfo {
  date: string;
  sha: string;
}

export default function AboutPage(): ReactNode {
  const [lastCommit, setLastCommit] = useState<CommitInfo | null>(null);

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
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="prose max-w-none">
            <h1 className="text-4xl font-bold mb-8">About Mission Enrollment</h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">A Gateway to Zinneke Rescue Mission</h2>
              <p>Mission Enrollment serves as the gateway to an extraordinary journey: the Zinneke Rescue Mission. Just as the Senne River shaped Brussels' history through its floods, creating the story of the Zinneke—the city's beloved mixed-breed dogs—we now face a new mission to preserve digital memories of the 2024 Zinneke Parade.</p>

              <p className="mt-4">This enrollment tool is your first step in joining a collaborative artistic endeavor. Like the historical Zinneke that brought character to Brussels, we're bringing together diverse participants—starting with the innovative minds from ETHGlobal Brussels—to help preserve parade memories through blockchain technology.</p>

              <p className="mt-4">The journey unfolds in two chapters: first, Mission Enrollment validates and welcomes participants; then, the Zinneke Rescue Mission will launch to safeguard cultural memories from the summer floods. Together, we're writing a new chapter in Brussels' rich history of community and resilience.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p>Born at ETHGlobal Brussels 2024, this project draws inspiration from the city's unique heritage. The Zinneke—Brussels' resilient mixed-breed dogs that once roamed the banks of the Senne River—symbolize the diverse community we're building. Just as these dogs adapted to the city's floods, we're using innovative technology to preserve memories of the Zinneke Parade, a celebration of Brussels' cultural diversity.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p>Your journey begins here with three simple steps:</p>
              <ul className="list-disc pl-6">
                <li>Verify your digital identity</li>
                <li>Confirm your participation in ETHGlobal Brussels</li>
                <li>Receive your mission enrollment attestation</li>
              </ul>
              <p className="mt-4">Once enrolled, you'll be ready to join the upcoming Zinneke Rescue Mission, where we'll work together to preserve parade memories through innovative blockchain technology.</p>
            </section>

            {lastCommit && (
              <div className="text-sm text-gray-600 mt-8">
                Last updated: {lastCommit.date} (commit: {lastCommit.sha})
              </div>
            )}
          </div>
        </div>
      </>
    </ClientLayout>
  );
}
