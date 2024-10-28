'use client';

import React from 'react';
import Image from 'next/image';

export default function LogoTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="fixed top-4 left-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          style={{
            width: '48px',
            height: '48px',
            objectFit: 'contain'
          }}
          priority
        />
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl">Logo Test Page</h1>
      </div>
    </div>
  );
}
