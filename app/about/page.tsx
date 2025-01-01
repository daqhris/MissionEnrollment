'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
            <h1 className="text-4xl font-bold mb-8">About: Mission Enrollment</h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">A Gateway to Zinneke Rescue Mission</h2>
              <p><a href="https://www.base.org/name/mission-enrollment" target="_blank" rel="noopener noreferrer">Mission Enrollment</a> serves as the gateway to an extraordinary journey: the <a href="https://github.com/daqhris/ZinnekeRescueMission" target="_blank" rel="noopener noreferrer">Zinneke Rescue Mission</a>. Just as the Senne River shaped Brussels' history through its floods more than once, creating the story of the Zinneke—the city's beloved mixed-breed dogs—we now face a new mission to preserve digital souvenirs of the <a href="https://www.brussels.be/zinneke-parade" target="_blank" rel="noopener noreferrer">2024 Zinneke Parade</a>.</p>

              <p className="mt-4">This enrollment tool is your first step in joining a collaborative artistic endeavor. Like the historical <a href="https://www.zinneke.org/" target="_blank" rel="noopener noreferrer">Zinneke</a> that brought character to Brussels, we're bringing together diverse participants—starting with the innovative minds from a global blockchain hackathon held in Brussels—to help preserve parade memories through blockchain technology.</p>

              <p className="mt-4">The journey unfolds in two chapters: first, <strong>Mission Enrollment</strong> validates and welcomes friends and collaborators; then, the <strong>Zinneke Rescue Mission</strong> will launch to safeguard cultural souvenirs salvaged from the 2024 summer floodwaters. Together, we're writing a new chapter in Brussels' rich history of community and resilience.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p>Born at <a href="https://ethglobal.com/events/brussels" target="_blank" rel="noopener noreferrer"><strong>ETHGlobal Brussels</strong></a> during the summer of 2024, our collaborative rescue mission draws inspiration from the city's unique heritage. The Zinneke—Brussels' resilient mixed-breed dogs that once roamed the banks of the Senne River—symbolize the diverse community we're building. We're using innovative technology to share and preserve memories of the biennial <a href="https://www.zinneke.org/nl/album-photo/zinneke-parade-2024-2/" target="_blank" rel="noopener noreferrer"><strong>Zinneke Parade</strong></a> with its legendary After-Party, combined with the <a href="https://kfda.be/en/festivals/2024-edition/programme/nightlife-2024/" target="_blank" rel="noopener noreferrer">closing night of the annual <strong>Kunstenfestivaldesarts</strong></a>, as <a href="https://github.com/daqhris/ZinnekeRescueMission?tab=readme-ov-file#rescue-strategy-onchain-postcards" target="_blank" rel="noopener noreferrer"><strong>onchain postcards</strong></a>, in celebration of Brussels' cultural diversity.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p>Your journey begins here with three simple steps:</p>
              <ul className="list-disc pl-6">
                <li>Submit your onchain name during an identity check</li>
                <li>Confirm your attendance at an international blockchain conference</li>
                <li>Receive an enrollment attestation on BASE Sepolia blockchain</li>
              </ul>
              <p className="mt-4">Once enrolled, you'll be ready to join the upcoming Zinneke Rescue Mission.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Created By</h2>
              <p>Mission Enrollment is the not-yet-ripe artistic fruit of a coding collaboration, openly carried out by a human and a non-human, coworking by way of <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener noreferrer"><strong>public <code>GIT</code> commits</strong></a> in the landscape of cyberspace:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Human Author:</strong> <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer">daqhris.base.eth</a> - Project architect and blockchain developer</li>
                <li><strong>AI Contributor:</strong> <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer">Devin</a> from <a href="https://cognition.ai/" target="_blank" rel="noopener noreferrer">Cognition Labs</a> - Assisted in development and implementation</li>
              </ul>
              <p className="mt-4">This blockchain-based project showcases how human creativity and AI capabilities can work together to preserve the cultural heritage of a European city festival.</p>
              <p className="mt-2">Enrollments are registered by in-test attestations linked to <a href="https://www.base.org/name/mission-enrollment" target="_blank" rel="noopener noreferrer"><strong>mission-enrollment.base.eth</strong></a>.</p>
              <p className="mt-2">Verifications are reliant on three <strong>open-source protocols</strong>: <a href="https://github.com/base-org/basenames" target="_blank" rel="noopener noreferrer">Basenames</a> (ENS), <a href="https://github.com/poap-xyz/poap.js" target="_blank" rel="noopener noreferrer">Proof of Attendance Protocol</a> (POAP) and <a href="https://github.com/ethereum-attestation-service/eas-sdk" target="_blank" rel="noopener noreferrer">Ethereum Attestation Service</a> (EAS).</p>

              <div className="mt-4 p-4 border rounded">
                <h3 className="text-lg font-semibold">Collaborative Milestone - "Pair Extraordinaire"</h3>
                <p className="mt-2">
                  On <strong>December 12, 2024</strong>, this project earned the{' '}
                  <a href="https://github.com/daqhris?achievement=pair-extraordinaire&tab=achievements" target="_blank" rel="noopener noreferrer">
                    "Pair Extraordinaire"
                  </a> achievement on GitHub following the merge of Git commit <code>429f7e4</code>, providing a verifiable timestamp of our{' '}
                  <strong>human–AI co-authorship</strong>.
                </p>
                <div className="mt-2 flex justify-center">
                  <Image
                    src="/pair-extraordinaire.png"
                    alt="Pair Extraordinaire Achievement Badge"
                    width={64}
                    height={64}
                    className="mt-2"
                  />
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Artistic Projects</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <a href="https://github.com/daqhris/MissionEnrollment" target="_blank" rel="noopener noreferrer">
                    <Image src="/logo.png" alt="Mission Enrollment Logo" width={128} height={128} />
                  </a>
                  <p className="mt-2 text-center">Mission Enrollment</p>
                </div>
                <div className="flex flex-col items-center">
                  <a href="https://ethglobal.com/showcase/zinnekerescuemission-9fwjf" target="_blank" rel="noopener noreferrer">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">Coming Soon</div>
                  </a>
                  <p className="mt-2 text-center">Zinneke Rescue Mission</p>
                </div>
              </div>
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
