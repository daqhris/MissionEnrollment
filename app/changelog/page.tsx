'use client';

import React, { useEffect, useState } from 'react';
import { ClientLayout } from '../../components/ClientLayout';
import { ErrorBoundary } from 'react-error-boundary';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';
import Link from 'next/link';

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

interface QuarterData {
  name: string;
  season: string;
  startDate: Date;
  endDate: Date;
  keyLearnings: string[];
  keyCommits: string[];
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
      <h2 className="text-xl font-bold mb-2">Error Loading Changelog</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
    </div>
  );
}

export default function ChangelogPage() {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCommit, setLastCommit] = useState<{ date: string; sha: string } | null>(null);

  const quarters: QuarterData[] = [
    {
      name: 'Q3 2024',
      season: 'Summer/Fall',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-09-30'),
      keyLearnings: [
        'Project foundation established through fork of Steve Dakh\'s repository',
        'Initial integration with Base blockchain for identity verification',
        'First financial support received through Rounds.wtf (0.0051 ETH)',
        'Core attestation functionality implemented',
        'Basic POAP verification system established'
      ],
      keyCommits: [
        '597cc88', // Initial fork and foundation
        'acc36db', // Base as primary chain
        '41e37a6', // Financial support milestone
        'f260060', // Core attestation implementation
        'f50ba07'  // POAP verification system
      ]
    },
    {
      name: 'Q4 2024',
      season: 'Fall/Winter',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-12-31'),
      keyLearnings: [
        'Pair Extraordinaire achievement unlocked on GitHub (human-AI collaboration milestone)',
        'Enhanced UI with improved text contrast and hover effects',
        'Expanded attestation capabilities with success confirmation screens',
        'Improved mobile responsiveness across all pages',
        'Refined user experience with clearer instructions and feedback'
      ],
      keyCommits: [
        'e7602e0', // Pair Extraordinaire achievement
        'b35be5b', // Text contrast improvements
        'eab4aa8', // Attestation implementation
        '48b04bc', // Mobile responsiveness enhancements
        '328b4aa'  // User experience improvements
      ]
    },
    {
      name: 'Q1 2025',
      season: 'Winter/Spring',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      keyLearnings: [
        'GitHub Actions workflow optimized for improved deployment reliability',
        'Artifact handling in GitHub Pages deployment refined',
        'Dependency management system upgraded',
        'Infrastructure stability improvements implemented',
        'Development environment standardization across contributors'
      ],
      keyCommits: [
        '0298253', // Provider initialization improvements
        '6f3ab7a', // Provider reordering for better stability
        '84367ec', // Error boundaries and initialization checks
        '3f7c795', // Provider initialization order
        'e4dd4b6'  // Client-side initialization improvements
      ]
    },
    {
      name: 'Q2 2025',
      season: 'Spring/Summer',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-05-31'),
      keyLearnings: [
        'Ethical charter restructured with improved logical organization',
        'External link system implemented for better accessibility',
        'Enhanced self-attestation with new schema (#1157)',
        'EIP-712 typing implemented for improved security',
        'Base Batch Europe buildathon participation and financial support (0.0050 ETH)',
        'Mainnet support added with clear migration information',
        'Dynamic role extraction from POAP data implemented',
        'Onboarding components integrated for improved user guidance'
      ],
      keyCommits: [
        'c326038', // Style improvements
        'b4f355c', // External link system
        'b2cbb3b', // Enhanced self-attestation
        '2c91b5f', // EIP-712 typing
        '7cc7aca', // Base Batch Europe
        'fe39f02', // Mainnet support
        'b002284', // Schema improvements
        'f3e8a11'  // Onboarding components
      ]
    }
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchCommits = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://api.github.com/repos/daqhris/MissionEnrollment/commits?since=2024-08-01T00:00:00Z&per_page=100'
        );
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data: GitHubCommit[] = await response.json();
        setCommits(data);
        
        if (data.length > 0) {
          const latestCommit = data[0];
          setLastCommit({
            date: formatDate(latestCommit.commit.author.date),
            sha: latestCommit.sha.substring(0, 7)
          });
        }
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommits();
  }, []);

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-4xl font-bold mb-8">Changelog: Mission Enrollment</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
            <p>
              <strong>Mission Enrollment</strong> is a collaborative blockchain application that has evolved significantly since its inception in August 2024. 
              This changelog documents the journey of this human-AI pair programming project, highlighting key milestones, technical advancements, 
              and the collaborative achievements between <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                daqhris.base.eth
                <ExternalLinkIcon />
              </a> and <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Devin AI
                <ExternalLinkIcon />
              </a>.
            </p>
            
            <p className="mt-4">
              The project began as a fork of <a href="https://github.com/slavik0329" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Steve Dakh&apos;s (slavik0329)
                <ExternalLinkIcon />
              </a> repository 
              and has since evolved into a sophisticated enrollment tool for the collaborative artistic <a href="https://github.com/daqhris/ZinnekeRescueMission" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Zinneke Rescue Mission
                <ExternalLinkIcon />
              </a> on the Base blockchain. The foundational merge commit <a href="https://github.com/daqhris/MissionEnrollment/commit/597cc88820f698e43c280196d94fa13dc525cd80" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                597cc88
                <ExternalLinkIcon />
              </a> represents the convergence of the initial forked codebase with the beginning of the human-AI collaboration.
            </p>
            
            <p className="mt-4">
              Over time, the application has grown to include robust identity verification through Basenames (ENS), 
              event attendance verification via POAP, and attestation creation using the Ethereum Attestation Service (EAS). 
              The project has received financial backing through <a href="https://rounds.wtf/contributors/daqhris" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Rounds.wtf
                <ExternalLinkIcon />
              </a> and <a href="https://devfolio.co/projects/mission-enrollment-b9f4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Devfolio
                <ExternalLinkIcon />
              </a>, and has been showcased at events like Base Batch Europe and ETHGlobal.
            </p>
            
            <p className="mt-4">
              This timeline chronicles the evolution of Mission Enrollment, from its early development stages to its current state as a 
              functional enrollment tool for the upcoming Zinneke Rescue Mission. It serves as a record of the collaborative work between 
              human and non-human contributors, documenting the gradual improvements, crucial turning points, and notable achievements 
              throughout the project&apos;s history.
            </p>
          </section>
          
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
                <h2 className="text-xl font-bold mb-2">Error Loading Commits</h2>
                <p>{error}</p>
              </div>
            ) : (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Development Timeline</h2>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                  
                  {quarters.map((quarter, quarterIndex) => (
                    <div key={quarter.name} className="mb-16">
                      {/* Quarter/Season Header */}
                      <div className="flex justify-center items-center mb-6">
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                          {quarter.name} • {quarter.season}
                        </div>
                      </div>
                      
                      {/* Key Learnings */}
                      <div className={`relative flex flex-col md:flex-row items-start gap-4 ${
                        quarterIndex % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}>
                        {/* Timeline dot */}
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-1.5"></div>
                        
                        {/* Content */}
                        <div className={`ml-6 md:ml-0 md:w-5/12 ${quarterIndex % 2 === 0 ? 'md:text-right' : ''}`}>
                          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Key Developments</h3>
                            
                            <ul className={`list-disc ${quarterIndex % 2 === 0 ? 'md:ml-auto md:mr-4' : 'ml-4'}`}>
                              {quarter.keyLearnings.map((learning, index) => (
                                <li key={index} className="mb-2">{learning}</li>
                              ))}
                            </ul>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <h4 className="font-medium text-sm mb-2 text-gray-700">Notable Commits:</h4>
                              <div className="flex flex-wrap gap-2">
                                {quarter.keyCommits.map((commitSha, index) => (
                                  <a 
                                    key={index}
                                    href={`https://github.com/daqhris/MissionEnrollment/commit/${commitSha}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-gray-700"
                                  >
                                    {commitSha.substring(0, 7)}
                                    <ExternalLinkIcon className="ml-1" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quarter Summary */}
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-lg mb-2">Quarter Summary</h3>
                        <p>
                          {quarter.name} ({quarter.season}) marked {quarterIndex === 0 ? 'the beginning' : 'a significant period'} in the 
                          Mission Enrollment project&apos;s development. 
                          {quarterIndex === 0 && ' The foundation was established and initial blockchain integrations were implemented.'}
                          {quarterIndex === 1 && ' The human-AI collaboration reached a milestone with the Pair Extraordinaire achievement, and the user experience was significantly enhanced.'}
                          {quarterIndex === 2 && ' Infrastructure improvements were the focus, with significant enhancements to deployment reliability and dependency management.'}
                          {quarterIndex === 3 && ' The project matured with advanced features like EIP-712 typing, mainnet support, and participation in the Base Batch Europe buildathon.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </ErrorBoundary>
          
          {lastCommit && (
            <div className="text-sm text-gray-600 mt-8 text-left flex items-center">
              <span>Last updated: </span>
              <a
                href="https://github.com/daqhris/MissionEnrollment/commits/main"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-content hover:text-accent flex items-center ml-1"
              >
                {lastCommit.date}
                <ExternalLinkIcon />
              </a>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
