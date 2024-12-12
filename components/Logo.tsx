'use client';

import React from 'react';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <Image
      src="/logo.svg"
      alt="Mission Enrollment Logo"
      width={40}
      height={40}
      priority
    />
    <span className="font-bold text-xl">Mission Enrollment</span>
  </div>
);

export default Logo;
