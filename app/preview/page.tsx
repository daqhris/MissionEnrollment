'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';

export default function PreviewPage() {
  const [lastUpdated, setLastUpdated] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoCommitInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = 'https://api.github.com/repos/daqhris/MissionEnrollment/commits?path=public/Preview-MissionEnrollment-WebApp.mp4&per_page=1';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const lastCommit = data[0];
          const commitDate = new Date(lastCommit.commit.author.date);
          const commitSha = lastCommit.sha.substring(0, 7);
          
          setLastUpdated(`${commitDate.getFullYear().toString().substring(2)}/${(commitDate.getMonth() + 1).toString().padStart(2, '0')}/${commitDate.getDate().toString().padStart(2, '0')} ${commitDate.getHours().toString().padStart(2, '0')}:${commitDate.getMinutes().toString().padStart(2, '0')} (commit: ${commitSha})`);
        } else {
          setError("No commit history found for the video file");
        }
      } catch (error) {
        console.error('Error fetching commit info:', error);
        setError("Failed to fetch commit information");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoCommitInfo();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#957777]">Video Preview</h1>
      <div className="max-w-4xl mx-auto">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
          src="/Preview-MissionEnrollment-WebApp.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="text-sm text-gray-500 mt-4 text-center">
          {loading ? (
            "Loading timestamp information..."
          ) : error ? (
            `Error: ${error}`
          ) : (
            <div className="flex items-center justify-center">
              <span>Last updated: </span>
              <a 
                href="https://github.com/daqhris/MissionEnrollment/commits/main/public/Preview-MissionEnrollment-WebApp.mp4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-content hover:text-accent flex items-center ml-1"
              >
                {lastUpdated}
                <ExternalLinkIcon />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
