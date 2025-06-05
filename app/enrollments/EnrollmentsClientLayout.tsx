'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../services/apollo/apolloClient';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export function EnrollmentsClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </ErrorBoundary>
  );
}
