'use client';

import React from 'react';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <Image
      src="/logo.png"
      alt="Mission Enrollment Logo"
      width={32}
      height={32}
      priority
    />
    <span className="font-bold text-xl text-[#957777]">Mission Enrollment</span>
  </div>
);

export default Logo;
