'use client';

import React, { useState, useEffect } from 'react';
import { Spinner } from './assets/Spinner';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('[ClientLayout] Component mounting...');
    try {
      setMounted(true);
      console.log('[ClientLayout] Component mounted successfully');
    } catch (err) {
      console.error('[ClientLayout] Error during mounting:', err);
      setError(err as Error);
    }
  }, []);

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold mb-2">Error Initializing Application</h2>
        <pre className="text-sm overflow-auto">{error.message}</pre>
      </div>
    );
  }

  if (!mounted) {
    console.log('[ClientLayout] Rendering loading state...');
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  console.log('[ClientLayout] Rendering children...');
  return <>{children}</>;
}
