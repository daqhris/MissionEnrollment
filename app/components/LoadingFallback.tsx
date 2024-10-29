'use client';

import React from 'react';

export default function LoadingFallback(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 text-lg">
        <div className="animate-pulse">Initializing providers...</div>
        <div className="text-sm text-gray-500 mt-2">This may take a few moments</div>
      </div>
    </div>
  );
}
