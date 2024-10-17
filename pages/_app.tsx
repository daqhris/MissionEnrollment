import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { WagmiConfig, createConfig } from "wagmi";
import { baseSepolia, optimismSepolia } from "wagmi/chains";
import ErrorBoundary from "../components/ErrorBoundary";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}

const wagmiConfig = createConfig({
  chains: [baseSepolia, optimismSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
  connectors: getDefaultWallets({
    projectId,
    appName: "Mission Enrollment",
  }).connectors,
});

// Configure Apollo Client
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider>
            <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
