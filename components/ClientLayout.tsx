'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '~/services/apollo/apolloClient';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
