import React from "react";
import getQueryClient from "../utils/queryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryClientProviderWrapperProps {
  children: React.ReactNode;
}

const QueryClientProviderWrapper: React.FC<QueryClientProviderWrapperProps> = ({ children }) => {
  const queryClientRef = React.useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = getQueryClient();
  }

  return <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>;
};

export default QueryClientProviderWrapper;
