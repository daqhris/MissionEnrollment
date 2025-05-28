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
        {/* Enhanced cinema-style container with ambient lighting */}
        <div className="relative p-1 rounded-xl bg-gradient-to-r from-[#957777] via-[#f59e0b] to-[#957777] shadow-2xl mb-6 float-animation">
          <div className="absolute inset-0 bg-gradient-to-r from-[#957777]/20 via-[#f59e0b]/20 to-[#957777]/20 rounded-xl blur-lg animate-pulse"></div>
          
          {/* Video container with enhanced backdrop effects */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg overflow-hidden backdrop-blur-sm p-3 transition-all duration-500 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] group">
            
            {/* Loading overlay with branded spinner */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10 rounded-lg">
                <div className="w-20 h-20 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#f59e0b] text-sm animate-pulse">Loading Mission Preview...</p>
              </div>
            )}
            
            {/* Video element with enhanced controls */}
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg shadow-2xl aspect-video transition-all duration-300 group-hover:shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]"
              src="/Preview-MissionEnrollment-WebApp.mp4"
              onLoadedData={handleVideoLoad}
              onError={() => setIsVideoLoading(false)}
              poster="/images/preview-thumbnail.jpg"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Enhanced information card with interactive elements */}
        <div className="card bg-amber-50 p-6 rounded-xl shadow-2xl border border-[#957777]/20 transition-all duration-300 hover:border-[#f59e0b]/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#f59e0b] flex items-center">
              <span className="w-3 h-3 bg-[#f59e0b] rounded-full mr-3 animate-pulse"></span>
              Enrollment Tool Demo
            </h2>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] rounded-full text-xs font-medium">
                RECORDED VIDEO
              </span>
            </div>
          </div>
          
          <p className="text-amber-200 mb-6 leading-relaxed">
            Experience the complete Mission Enrollment workflow: connect your wallet, verify your identity through Basenames, 
            validate POAP ownership and event attendance, then create and publish your blockchain attestation for the Zinneke Rescue Mission.
          </p>
          
          {/* Enhanced feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-200 p-4 rounded-lg border border-[#957777]/20">
              <h3 className="text-[#957777] font-semibold mb-2">🔗 Wallet Integration</h3>
              <p className="text-amber-900 text-sm">Identity check with Base network support</p>
            </div>
            <div className="bg-amber-200 p-4 rounded-lg border border-[#957777]/20">
              <h3 className="text-[#957777] font-semibold mb-2">🏷️ POAP Verification</h3>
              <p className="text-amber-900 text-sm">Automated event attendance validation</p>
            </div>
            <div className="bg-amber-200 p-4 rounded-lg border border-[#957777]/20">
              <h3 className="text-[#957777] font-semibold mb-2">⚡ EAS Attestations</h3>
              <p className="text-amber-800 text-sm">Onchain self-enrollment and public attestions</p>
            </div>
          </div>
          
          {/* Timestamp and metadata */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-amber-200">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-200 px-4 py-2 rounded-lg flex items-center border border-[#957777]/20">
                <span className="text-[#957777] text-sm mr-2">⏱️ Duration:</span>
                <span className="text-amber-900 text-sm font-medium">6:33</span>
              </div>
              <div className="bg-amber-200 px-4 py-2 rounded-lg flex items-center border border-[#957777]/20">
                <span className="text-[#957777] text-sm mr-2">📱 Format:</span>
                <span className="text-amber-900 text-sm font-medium">MP4 • 1080p</span>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-amber-200 px-4 py-2 rounded-lg border border-[#957777]/20">
                <span className="text-[#957777] text-sm animate-pulse">Loading timestamp...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <span className="text-red-600 text-sm">Timestamp unavailable</span>
              </div>
            ) : (
              <a 
                href="https://github.com/daqhris/MissionEnrollment/commits/main/public/Preview-MissionEnrollment-WebApp.mp4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-amber-200 hover:bg-[#f59e0b]/20 px-4 py-2 rounded-lg flex items-center transition-all duration-200 group border border-[#957777]/20"
              >
                <span className="text-[#957777] text-sm mr-2">📅 Updated:</span>
                <span className="text-amber-900 text-sm mr-2">{lastUpdated}</span>
                <ExternalLinkIcon className="w-4 h-4 text-[#957777] group-hover:text-[#f59e0b] transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
