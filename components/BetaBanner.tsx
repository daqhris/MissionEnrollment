'use client';

import React, { useState, useEffect } from 'react';

export const BetaBanner = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  const [, setHasDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('betaBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setHasDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
    localStorage.setItem('betaBannerDismissed', 'true');
  };

  if (!isVisible) return <></>;

  return (
    <div className="w-full bg-[#957777]/20 py-2 px-4 rounded-lg mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-2 text-sm font-bold border border-[#957777] px-2 py-0.5 rounded-full bg-[#957777] text-white">
          BETA
        </div>
        <p className="text-sm">
          This application is currently in beta testing. Features may change and some functionality might be limited.
        </p>
      </div>
      <button 
        onClick={handleDismiss}
        className="text-sm hover:text-[#957777] transition-colors ml-2 border border-white px-2 py-0.5 rounded-md"
      >
        Dismiss
      </button>
    </div>
  );
};
