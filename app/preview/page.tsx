'use client';

import React, { useEffect, useState, useCallback } from 'react';

export default function PreviewPage() {
  const [videoInfo, setVideoInfo] = useState({
    date: "4/5/2025, 3:56:53 PM",
    commit: "3c8f11e"
  });

  const fetchVideoLastModified = useCallback(async () => {
    try {
      const response = await fetch('/Preview-MissionEnrollment-WebApp.mp4', { method: 'HEAD' });
      if (response.ok) {
        const lastModified = new Date(response.headers.get('last-modified') || '');
        if (!isNaN(lastModified.getTime())) {
          setVideoInfo(prevInfo => ({
            date: lastModified.toLocaleString(),
            commit: prevInfo.commit // Keep the existing commit hash
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
    }
  }, []);

  useEffect(() => {
    fetchVideoLastModified();
    
    const interval = setInterval(fetchVideoLastModified, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [fetchVideoLastModified]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#957777]">Video Preview</h1>
      <div className="max-w-4xl mx-auto">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
          src="/Preview-MissionEnrollment-WebApp.mp4"
          onLoadedMetadata={() => fetchVideoLastModified()}
        >
          Your browser does not support the video tag.
        </video>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Last updated: {videoInfo.date} (commit: {videoInfo.commit})
        </p>
      </div>
    </div>
  );
}
