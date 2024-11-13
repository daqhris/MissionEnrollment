'use client';

import React, { useEffect } from 'react';

interface RecentAttestationsViewProps {
  title: string;
  pageSize?: number;
}

export function RecentAttestationsView({ title, pageSize = 20 }: RecentAttestationsViewProps): React.ReactElement {
  useEffect(() => {
    console.log('[RecentAttestationsView] Component mounted');
    return () => {
      console.log('[RecentAttestationsView] Component unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <div className="text-center py-8">
        <p>Loading attestations...</p>
        <p className="text-sm text-gray-500 mt-2">
          Page Size: {pageSize}
        </p>
      </div>
    </div>
  );
}
