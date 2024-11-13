'use client';

import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '~/services/apollo/apolloClient';
import { Spinner } from './assets/Spinner';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
