'use client';

import React from 'react';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-4">
    <Image
      src="/logo.png"
      alt="Mission Enrollment Logo"
      width={64}
      height={64}
      priority
    />
    <span className="font-bold text-2xl text-[#957777]">Mission Enrollment</span>
  </div>
);

export default Logo;
