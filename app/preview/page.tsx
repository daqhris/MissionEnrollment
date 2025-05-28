'use client';

import { useEffect, useState, useRef } from 'react';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';

export default function PreviewPage() {
  const [lastUpdated, setLastUpdated] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          setLastUpdated(`${months[commitDate.getMonth()]} ${commitDate.getDate()}, ${commitDate.getFullYear()} ${commitDate.getHours().toString().padStart(2, '0')}:${commitDate.getMinutes().toString().padStart(2, '0')}`);
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

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#957777]">Video Preview</h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Cinema-style container with backdrop blur and gradient border */}
        <div className="relative p-1 rounded-xl bg-gradient-to-r from-[#957777] via-[#f59e0b] to-[#957777] shadow-2xl mb-6 float-animation">
          <div className="absolute inset-0 bg-gradient-to-r from-[#957777]/20 via-[#f59e0b]/20 to-[#957777]/20 rounded-xl blur-md"></div>
          
          {/* Video container with backdrop filter */}
          <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg overflow-hidden backdrop-blur-sm backdrop-filter p-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            
            {/* Loading overlay */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-900/80 z-10 rounded-lg">
                <div className="w-16 h-16 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Video element */}
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg shadow-inner aspect-video"
              src="/Preview-MissionEnrollment-WebApp.mp4"
              onLoadedData={handleVideoLoad}
              poster="/images/preview-thumbnail.jpg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Video information card */}
        <div className="card bg-blue-900/30 backdrop-blur-sm backdrop-filter p-6 rounded-xl shadow-lg border border-[#957777]/30 transition-all duration-300 hover:border-[#f59e0b]/50">
          <h2 className="text-xl font-semibold mb-3 text-[#f59e0b]">Mission Enrollment Demo</h2>
          <p className="text-[#a57939] mb-4">
            This video demonstrates the key features of the Mission Enrollment dApp, including wallet connection, attestation verification, and POAP validation.
          </p>
          
          {/* Timestamp information */}
          <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
            <div className="bg-blue-800/50 px-4 py-2 rounded-lg inline-flex items-center">
              <span className="text-amber-300 text-sm mr-1">Duration:</span>
              <span className="text-white text-sm">6:33</span>
            </div>
            
            {loading ? (
              <div className="bg-blue-800/50 px-4 py-2 rounded-lg">
                <span className="text-amber-300 text-sm">Loading timestamp...</span>
              </div>
            ) : error ? (
              <div className="bg-red-800/50 px-4 py-2 rounded-lg">
                <span className="text-red-300 text-sm">{`Error: ${error}`}</span>
              </div>
            ) : (
              <div className="bg-blue-800/50 px-4 py-2 rounded-lg inline-flex items-center">
                <span className="text-amber-300 text-sm mr-1">Last updated:</span>
                <a 
                  href="https://github.com/daqhris/MissionEnrollment/commits/main/public/Preview-MissionEnrollment-WebApp.mp4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-[#f59e0b] flex items-center ml-1 text-sm transition-colors"
                >
                  {lastUpdated}
                  <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
