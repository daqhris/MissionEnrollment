'use client';

import React from 'react';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-3 transition-all duration-300 hover:opacity-90">
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
    <div className="flex flex-col">
      <span className="font-bold text-xl md:text-2xl text-[#957777]">
        Mission Enrollment
      </span>
      <span className="text-sm text-gray-500 italic">
        Chapter 1 → Zinneke Rescue Mission
      </span>
    </div>
  </div>
);

export default Logo;
