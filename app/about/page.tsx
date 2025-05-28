'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ClientLayout } from '../../components/ClientLayout';
import type { ReactNode } from 'react';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';
import { FarcasterIcon } from '../../components/FarcasterIcon';
import { DeepWikiIcon } from '../../components/DeepWikiIcon';

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
        const commitDate = new Date(data.commit.author.date);
        setLastCommit({
          date: commitDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
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
          <div className="prose max-w-none bg-amber-200 p-4 md:px-16 rounded">
            <h1 className="text-4xl bg-amber-100 font-bold mb-8 p-4 rounded border-2 text-amber-700 border-amber-700">About: Mission Enrollment</h1>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">The Gateway to the Zinneke Rescue Mission</h2>
              <p className="text-gray-900"><a href="https://www.base.org/name/mission-enrollment" target="_blank" rel="noopener noreferrer"><strong>Mission Enrollment</strong></a><ExternalLinkIcon /> serves as the gateway to an extraordinary journey: the <a href="https://github.com/daqhris/ZinnekeRescueMission" target="_blank" rel="noopener noreferrer"><strong>Zinneke Rescue Mission</strong></a><ExternalLinkIcon />. Just as the <a href="https://en.wikipedia.org/wiki/Senne_(river)" target="_blank" rel="noopener noreferrer">Senne river</a><ExternalLinkIcon /> shaped Brussels' history through its floods more than once — creating the story of the Zinneke, the city's beloved mixed-breed dogs — we are now flowing from many nodes and layers of the world's computer network <a href="https://ethereum.org/en/" target="_blank" rel="noopener noreferrer"><strong>Ethereum</strong></a><ExternalLinkIcon /> to preserve the digital souvenirs of the <a href="https://www.brussels.be/zinneke-parade" target="_blank" rel="noopener noreferrer"><strong>2024 Zinneke Parade</strong></a><ExternalLinkIcon />.</p>

              <p className="mt-4 text-gray-900">This enrollment tool is your first step in joining a collaborative and artistic adventure. Like the historical <a href="https://www.zinneke.org/" target="_blank" rel="noopener noreferrer">Zinneke</a><ExternalLinkIcon /> that brought character to Brussels, we're bringing together various participants — starting with the innovative minds from a global blockchain gathering once held in Belgium — to preserve citywide parade memories through blockchain technology.</p>

              <p className="mt-4 text-gray-900">The digital journey unfolds into two chapters spanning more than one human year: <em>first,</em> <strong>Mission Enrollment</strong> validates and welcomes friends and collaborators; <em>second,</em> the <strong>Zinneke Rescue Mission</strong> will launch to safeguard the visual souvenirs of festive events salvaged from drowning in torrential floodwaters. Together, we are writing a brilliant chapter in Brussels' contemporary history of community, resilience and art.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">Our Founding Story</h2>
              <p className="text-gray-900">Born from two <a href="https://ethglobal.com" target="_blank" rel="noopener noreferrer"><strong>ETHGlobal</strong></a><ExternalLinkIcon /> hackathons, one held in-person and the next held <a href="https://ethglobal.com/events/superhack2024" target="_blank" rel="noopener noreferrer">virtually</a><ExternalLinkIcon /> during the <strong>summer of 2024</strong>, our collaborative rescue mission draws inspiration from the unique cultural heritage of Brussels. The Zinneke — named after street-roaming dogs that were banished to the banks of the Senne River from medieval times to the modern era — nowadays refers to anyone living in the city with a mixed heritage. We will be using a decentralized toolkit to diffuse and circulate photographs, taken in 2024 at the joint celebration of a legendary afterparty of the biennial <a href="https://www.zinneke.org/nl/album-photo/zinneke-parade-2024-2/" target="_blank" rel="noopener noreferrer"><strong>Zinneke Parade</strong></a><ExternalLinkIcon /> and the closing night of the annual <a href="https://kfda.be/en/archives/" target="_blank" rel="noopener noreferrer"><strong>Kunstenfestivaldesarts</strong></a><ExternalLinkIcon />, as <a href="https://github.com/daqhris/ZinnekeRescueMission?tab=readme-ov-file#rescue-strategy-onchain-postcards" target="_blank" rel="noopener noreferrer"><strong>onchain postcards</strong></a><ExternalLinkIcon />.</p>
              
              <p className="mt-4 text-gray-900">This year, our circle of friends is expanding to include coders from <a href="https://ethdenver.com/" target="_blank" rel="noopener noreferrer"><strong>ETHDenver</strong></a><ExternalLinkIcon /> buildathons, namely attendees of <a href="https://www.coinbase.com/developer-platform" target="_blank" rel="noopener noreferrer"><strong>Coinbase Developer Platform</strong></a><ExternalLinkIcon /> workshops and gatherings. This month of May, in concurrent timing with <a href="https://www.zinneke.org/nl/album-photo/zinneke-parade-2024-2/" target="_blank" rel="noopener noreferrer"><strong>Kunstenfestivaldesarts 2025</strong></a><ExternalLinkIcon />, this project is being built and showcased during <a href="https://base-batch-europe.devfolio.co/" target="_blank" rel="noopener noreferrer"><strong>Base Batch Europe</strong></a><ExternalLinkIcon />, as part of the virtual <a href="https://basebatches.xyz/" target="_blank" rel="noopener noreferrer"><strong>Base Batches 001</strong></a><ExternalLinkIcon /> program. Our participation to the competition reflects our long-term commitment to pushing the boundaries of onchain applications, publicly performing pair programming as outcasts of the banking system, and fostering agentic exploration of the Ethereum ecosystem.</p>
            </section>

            <section className="mb-8 p-4 bg-amber-100 rounded border-2 border-amber-700">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">How It Works</h2>
              <p className="text-gray-900">Your journey begins here with three verification steps:</p>
              <ul className="list-disc pl-6 text-gray-900">
                <li>Submit your onchain name during an identity check</li>
                <li>Confirm your attendance at approved blockchain events: <a href="https://ethglobal.com/events/brussels" target="_blank" rel="noopener noreferrer">ETHGlobal Brussels 2024</a><ExternalLinkIcon /> or <a href="https://poap.gallery/search?term=Coinbase%20Developer%20Platform" target="_blank" rel="noopener noreferrer">ETHDenver Coinbase CDP 2025</a><ExternalLinkIcon /></li>
                <li>Create an enrollment attestation on a public blockchain</li>
              </ul>
              <p className="mt-4 text-gray-900">Once self-enrolled, you'll be certified and granted access to the upcoming <strong>Zinneke Rescue Mission</strong>.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">Co-Created By</h2>
              <p className="text-gray-900">Mission Enrollment is the not-yet-ripe artistic fruit of a coding collaboration that's being openly carried out by a human and a non-human who are co-working via <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener noreferrer"><strong>public <code>GIT</code> commits</strong></a><ExternalLinkIcon /> in the landscape of cyberspace:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-900">
                <li><strong>Human Author:</strong> <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer"><strong>daqhris</strong>.base.eth</a><ExternalLinkIcon /> - Creator, project architect and blockchain developer <span className="ml-2">
                    <a href="https://farcaster.xyz/daqhris" target="_blank" rel="noopener noreferrer" title="Follow on Farcaster">
                      <FarcasterIcon />
                    </a>
                  </span></li>
                <li><strong>Non-human Engineer:</strong> <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer"><strong>Devin AI</strong></a><ExternalLinkIcon /> (from <a href="https://cognition.ai/" target="_blank" rel="noopener noreferrer">Cognition Labs</a><ExternalLinkIcon />) - Assisted in coding, development and implementation <a href="https://deepwiki.com/daqhris/MissionEnrollment" target="_blank" rel="noopener noreferrer" className="ml-2" title="View on DeepWiki"><DeepWikiIcon /></a></li>
              </ul>
              <p className="mt-4 text-gray-900">It is an artistic project that enables human creativity and AI capabilities to come together, on the verge of a posthuman era, for the preservation of the cultural heritage of a European city festival.</p>
              <p className="mt-2 text-gray-900">All enrollments are registered by in-test attestations linked to <a href="https://www.base.org/name/mission-enrollment" target="_blank" rel="noopener noreferrer"><strong>mission-enrollment</strong>.base.eth</a><ExternalLinkIcon />. Registration methods are reliant on 3 public protocols on the Base (or Base Sepolia) blockchain: <a href="https://github.com/base-org/basenames" target="_blank" rel="noopener noreferrer">Basenames</a> (ENS)<ExternalLinkIcon />, <a href="https://github.com/poap-xyz/poap.js" target="_blank" rel="noopener noreferrer">Proof of Attendance Protocol</a> (POAP)<ExternalLinkIcon /> and <a href="https://github.com/ethereum-attestation-service/eas-sdk" target="_blank" rel="noopener noreferrer">Ethereum Attestation Service</a> (EAS)<ExternalLinkIcon />.</p>

              <div className="mt-4 bg-amber-100 p-4 border-2 border-amber-700 rounded">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold flex-grow text-amber-700">Collaborative Milestone: Pair Extraordinaire</h3>
                  <Image
                    src="/pair-extraordinaire.png"
                    alt="Pair Extraordinaire Achievement Badge"
                    width={48}
                    height={48}
                    className="flex-shrink-0"
                  />
                </div>
                <p className="mt-2 text-gray-900">
                  On <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">2024-12-12</code>, <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">daqhris</code> and <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">devin</code> received their first{' '}
                  <a href="https://github.com/daqhris?achievement=pair-extraordinaire&amp;tab=achievements" target="_blank" rel="noopener noreferrer">
                    <strong>Pair Extraordinaire</strong>
                  </a><ExternalLinkIcon /> achievement on <a href="https://github.com/daqhris/MissionEnrollment/pull/177" target="_blank" rel="noopener noreferrer"><strong>GitHub</strong></a><ExternalLinkIcon /> after commit{' '}
                  <a href="https://github.com/daqhris/MissionEnrollment/commit/429f7e4" target="_blank" rel="noopener noreferrer"><code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">429f7e4</code></a><ExternalLinkIcon />. This granted an independent record of <strong>human-nonhuman co-authorship</strong> to the project.
                </p>
              </div>
            </section>

            <section className="mb-8 p-4 bg-amber-900 text-amber-50 rounded">
              <h2 className="text-2xl font-semibold mb-4 text-amber-100">Financial Support</h2>
              
              <div className="mt-4 p-4 border rounded">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold flex-grow text-amber-100">Grant #1: Base Build Rounds.wtf</h3>
                  <div className="flex-shrink-0 text-2xl">🚀</div>
                </div>
                <p className="mt-2 text-amber-50">
                  On <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">2024-09-16</code>, Mission Enrollment received its first financial support: <strong>0.0051 ETH</strong> through{' '}
                  <a href="https://rounds.wtf/contributors/daqhris" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>Rounds.wtf</strong>
                  </a><ExternalLinkIcon /> as part of the{' '}
                  <a href="https://farcaster.xyz/daqhris/0xbba773b923393cb4bde58f04ec3f446c9ee988d4" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>Base-Builds</strong>
                  </a><ExternalLinkIcon /> Farcaster community funding initiative. 
                  The transaction is permanently recorded on Base blockchain as{' '}
                  <a href="https://basescan.org/tx/0x679e9ea73d10423ebdecfe3b42e8b9923cf33488bf7cf60454cfec582a946b5d" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>0x679e9ea7...82a946b5d</strong>
                  </a><ExternalLinkIcon />
                </p>
                
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold flex-grow text-amber-100">Grant #2: Devfolio Crypto Cheer</h3>
                  <div className="flex-shrink-0 text-2xl">🎉</div>
                </div>
                <p className="mt-2 text-amber-50">
                  On <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">2025-05-17</code>, Mission Enrollment received <strong>0.0050 ETH worth of cheers</strong> on{' '}
                  <a href="https://devfolio.co/projects/mission-enrollment-b9f4" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>Devfolio</strong>
                  </a><ExternalLinkIcon /> during the{' '}
                  <a href="https://base-batch-europe.devfolio.co/" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>Base Batch Europe</strong>
                  </a><ExternalLinkIcon /> buildathon competition. Permanently recorded as{' '}
                  <a href="https://base.easscan.org/attestation/view/0xd19f9f8afc99585dc634a311f8e7c4c691ecfea75d0083032b8b7c696f1fba0d" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-amber-200">
                    <strong>attestation 0xd19f9f8a...f1fba0d</strong>
                  </a><ExternalLinkIcon /> with the message <em>"To onboarding many more to the Mission!"</em>.
                </p>
              </div>
            </section>

            <section className="mb-8 p-4 rounded">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">Artistic Projects</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <a href="https://github.com/daqhris/MissionEnrollment" target="_blank" rel="noopener noreferrer">
                    <Image src="/logo.png" alt="Mission Enrollment Logo" width={128} height={128} />
                  </a>
                  <p className="mt-2 text-center text-gray-900">Mission Enrollment</p>
                </div>
                <div className="flex flex-col items-center">
                  <a href="https://ethglobal.com/showcase/zinnekerescuemission-9fwjf" target="_blank" rel="noopener noreferrer">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">Coming Soon</div>
                  </a>
                  <p className="mt-2 text-center text-gray-900">Zinneke Rescue Mission</p>
                </div>
              </div>
            </section>

            {lastCommit && (
              <div className="text-sm text-gray-900 mt-8 text-left flex items-center">
                <span>Last updated: </span>
                <a
                  href="https://github.com/daqhris/MissionEnrollment/commits/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-content hover:text-accent flex items-center ml-1"
                >
                  <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">{lastCommit.date}</code>
                  <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      </>
    </ClientLayout>
  );
}
