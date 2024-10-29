'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import LoadingFallback from './LoadingFallback';

// Add early error logging
console.log('[ClientLayout] Initializing...');

const ClientProviders = dynamic(
  () => {
    console.log('[ClientLayout] Loading providers dynamically...');
    return import('../providers').catch(error => {
      console.error('[ClientLayout] Failed to load providers:', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          cause: error.cause
        },
        timestamp: new Date().toISOString()
      });
      throw error; // Re-throw to be caught by ErrorBoundary
    });
  },
  {
    loading: () => <LoadingFallback />,
    ssr: false // Disable SSR for providers to ensure client-side only
  }
);

function ErrorFallback({ error }: FallbackProps): React.ReactElement {
  console.error('[ClientLayout] Error caught by boundary:', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    },
    timestamp: new Date().toISOString(),
    location: 'ClientLayout'
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Initialization Error</h2>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        <div className="text-xs text-gray-500">
          Please check the console for more details.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {error.stack}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  console.log('[ClientLayout] Rendering...');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <ClientProviders>{children}</ClientProviders>
      </Suspense>
    </ErrorBoundary>
  );
}
