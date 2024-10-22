declare module '@tanstack/react-query' {
  import React from 'react';

  export interface QueryClient {
    // Add any necessary properties or methods
  }

  export const QueryClientProvider: React.FC<{
    children: React.ReactNode;
    client: QueryClient;
  }>;

  export const QueryClient: new () => QueryClient;
}
