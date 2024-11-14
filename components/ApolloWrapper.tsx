'use client';

import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../services/apollo/apolloClient';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
