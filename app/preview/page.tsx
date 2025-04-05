'use client';

import React, { useEffect, useState } from 'react';

export default function PreviewPage() {
  const [videoInfo, setVideoInfo] = useState({
    date: "Loading...",
    commit: "Loading..."
  });
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
          const commitSha = lastCommit.sha.substring(0, 7); // Short commit hash
          
          setVideoInfo({
            date: commitDate.toLocaleString(),
            commit: commitSha
          });
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
        <p className="text-sm text-gray-500 mt-4 text-center">
          {loading ? (
            "Loading timestamp information..."
          ) : error ? (
            `Error: ${error}`
          ) : (
            `Last updated: ${videoInfo.date} (commit: ${videoInfo.commit})`
          )}
        </p>
      </div>
    </div>
  );
}
