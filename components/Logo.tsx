'use client';

import React from 'react';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-3 transition-all duration-300 hover:opacity-90">
    <div className="flex items-center">
      {/* Mission Enrollment */}
      <div className="flex items-center">
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <Image
            src="/logo.png"
            alt="Mission Enrollment Logo"
            width={48}
            height={48}
            priority
            className="transition-transform duration-500 hover:scale-110"
          />
        </div>
        <span className="font-bold text-xl md:text-2xl text-[#957777] ml-3">
          Mission Enrollment
        </span>
      </div>
      
      {/* Arrow */}
      <div className="mx-3 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </div>
      
      {/* Zinneke Rescue Mission */}
      <div className="flex items-center">
        <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-700 flex items-center justify-center w-12 h-12">
          <span className="text-white text-xl">🔜</span>
        </div>
        <span className="font-bold text-xl md:text-2xl text-gray-500 ml-3">
          Zinneke Rescue
        </span>
      </div>
    </div>
  </div>
);

export default Logo;
