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
  commits: GitHubCommit[];
}

interface TimelinePeriod {
  quarter: string;
  season: string;
  commits: GitHubCommit[];
  majorChanges: GitHubCommit[];
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
  const [timelinePeriods, setTimelinePeriods] = useState<TimelinePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCommit, setLastCommit] = useState<{ date: string; sha: string } | null>(null);

  const quarters: QuarterData[] = [
    {
      name: 'Q3 2024',
      season: 'Summer/Fall',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-09-30'),
      commits: []
    },
    {
      name: 'Q4 2024',
      season: 'Fall/Winter',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-12-31'),
      commits: []
    },
    {
      name: 'Q1 2025',
      season: 'Winter/Spring',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      commits: []
    },
    {
      name: 'Q2 2025',
      season: 'Spring/Summer',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-05-31'),
      commits: []
    }
  ];

  const isMajorChange = (commit: GitHubCommit): boolean => {
    const message = commit.commit.message.toLowerCase();
    
    if (message.includes('merge pull request')) {
      return true;
    }
    
    const keywordsForMajorChanges = [
      'add', 'feature', 'implement', 'create', 'new', 
      'update', 'enhance', 'improve', 'fix', 'refactor',
      'support', 'integrate', 'optimize'
    ];
    
    return keywordsForMajorChanges.some(keyword => message.includes(keyword));
  };

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
        
        const organizedCommits = quarters.map(quarter => {
          const quarterCommits = data.filter(commit => {
            const commitDate = new Date(commit.commit.author.date);
            return commitDate >= quarter.startDate && commitDate <= quarter.endDate;
          });
          
          const majorChanges = quarterCommits.filter(isMajorChange);
          
          let finalMajorChanges = majorChanges;
          if (majorChanges.length < 5 && quarterCommits.length >= 5) {
            const additionalCommits = quarterCommits
              .filter(commit => !majorChanges.includes(commit))
              .slice(0, 5 - majorChanges.length);
            
            finalMajorChanges = [...majorChanges, ...additionalCommits];
          }
          
          return {
            quarter: quarter.name,
            season: quarter.season,
            commits: quarterCommits,
            majorChanges: finalMajorChanges
          };
        });
        
        const periodsWithCommits = organizedCommits.filter(period => period.commits.length > 0);
        
        setTimelinePeriods(periodsWithCommits.sort((a, b) => {
          const aDate = new Date(quarters.find(q => q.name === a.quarter)?.startDate || 0);
          const bDate = new Date(quarters.find(q => q.name === b.quarter)?.startDate || 0);
          return aDate.getTime() - bDate.getTime();
        }));
        
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
                  
                  {timelinePeriods.map((period, periodIndex) => (
                    <div key={period.quarter} className="mb-12">
                      {/* Quarter/Season Header */}
                      <div className="flex justify-center items-center mb-6">
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                          {period.quarter} • {period.season}
                        </div>
                      </div>
                      
                      {/* Major Changes */}
                      <div className="space-y-8">
                        {period.majorChanges.length > 0 ? (
                          period.majorChanges.map((commit, index) => (
                            <div 
                              key={commit.sha} 
                              className={`relative flex flex-col md:flex-row items-start gap-4 ${
                                index % 2 === 0 ? 'md:flex-row-reverse' : ''
                              }`}
                            >
                              {/* Timeline dot */}
                              <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-1.5"></div>
                              
                              {/* Content */}
                              <div className={`ml-6 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">
                                      {formatDate(commit.commit.author.date)}
                                    </span>
                                    <a 
                                      href={commit.html_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                      {commit.sha.substring(0, 7)}
                                      <ExternalLinkIcon />
                                    </a>
                                  </div>
                                  
                                  <h3 className="font-semibold text-lg mb-2">
                                    {commit.commit.message.split('\n')[0]}
                                  </h3>
                                  
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-600">
                                      By: {commit.author?.login || commit.commit.author.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 italic">
                            No major changes recorded for this period.
                          </div>
                        )}
                      </div>
                      
                      {/* Period summary */}
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-lg mb-2">Period Summary</h3>
                        <p>
                          During {period.quarter} ({period.season}), the project saw {period.commits.length} commits, 
                          with {period.majorChanges.length} major changes highlighted above. 
                          {period.commits.length > 0 && (
                            <>
                              {' '}The period began with commit <a href={period.commits[period.commits.length - 1].html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                                {period.commits[period.commits.length - 1].sha.substring(0, 7)}
                                <ExternalLinkIcon />
                              </a> and 
                              ended with <a href={period.commits[0].html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                                {period.commits[0].sha.substring(0, 7)}
                                <ExternalLinkIcon />
                              </a>.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </ErrorBoundary>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Collaborative Achievements</h2>
            <div className="mt-4 p-4 border rounded">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold flex-grow">Pair Extraordinaire Achievement</h3>
              </div>
              <p className="mt-2">
                On 2024/12/12, <code>daqhris</code> and <code>devin</code> unlocked their first 
                <a 
                  href="https://github.com/daqhris?achievement=pair-extraordinaire&tab=achievements" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1"
                >
                  <strong>Pair Extraordinaire</strong>
                  <ExternalLinkIcon />
                </a> achievement on 
                <a 
                  href="https://github.com/daqhris/MissionEnrollment/pull/177" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1"
                >
                  <strong>GitHub</strong>
                  <ExternalLinkIcon />
                </a>, following the commit 
                <a 
                  href="https://github.com/daqhris/MissionEnrollment/commit/429f7e4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1"
                >
                  <code>429f7e4</code>
                  <ExternalLinkIcon />
                </a> in the public code repository, which awarded an independent record of <strong>human-nonhuman co-authorship</strong> to the project.
              </p>
            </div>
            
            <div className="mt-4 p-4 border rounded">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold flex-grow">Financial Support Milestones</h3>
              </div>
              <p className="mt-2">
                <strong>Grant #1:</strong> On 2024/09/16, Mission Enrollment received its first financial support: <strong>0.0051 ETH</strong> through{' '}
                <a 
                  href="https://rounds.wtf/contributors/daqhris" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <strong>Rounds.wtf</strong>
                  <ExternalLinkIcon />
                </a> as part of the{' '}
                <a 
                  href="https://farcaster.xyz/daqhris/0xbba773b923393cb4bde58f04ec3f446c9ee988d4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <strong>Base-Builds</strong>
                  <ExternalLinkIcon />
                </a> Farcaster community funding initiative.
              </p>
              <p className="mt-2">
                <strong>Grant #2:</strong> On 2025/05/17, Mission Enrollment received <strong>0.0050 ETH worth of cheers</strong> on{' '}
                <a 
                  href="https://devfolio.co/projects/mission-enrollment-b9f4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <strong>Devfolio</strong>
                  <ExternalLinkIcon />
                </a> during the{' '}
                <a 
                  href="https://base-batch-europe.devfolio.co/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <strong>Base Batch Europe</strong>
                  <ExternalLinkIcon />
                </a> buildathon competition.
              </p>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Future Roadmap</h2>
            <p>
              The Mission Enrollment project continues to evolve as a gateway to the upcoming Zinneke Rescue Mission. 
              Future development will focus on enhancing the user experience, expanding network support, and preparing 
              for the launch of the Zinneke Rescue Mission, which will focus on preserving digital souvenirs of the 
              2024 Zinneke Parade through blockchain technology.
            </p>
            <p className="mt-4">
              For the most up-to-date information on the project&apos;s development, visit the{' '}
              <Link href="/about" className="text-blue-600 hover:text-blue-800 cursor-pointer">
                About page
              </Link>{' '}
              or check the{' '}
              <a 
                href="https://github.com/daqhris/MissionEnrollment" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                GitHub repository
                <ExternalLinkIcon />
              </a>.
            </p>
          </section>
          
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
