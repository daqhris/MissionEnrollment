'use client';

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "~~/services/apollo/apolloClient";
import { ReactNode } from "react";

interface ClientApolloProviderProps {
  children: ReactNode;
}

export function ClientApolloProvider({ children }: ClientApolloProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
