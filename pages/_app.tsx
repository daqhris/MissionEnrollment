import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../services/apollo/apolloClient';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the console for more details.</h1>;
    }

    return this.props.children;
  }
}

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  React.useEffect(() => {
    console.log("MyApp component mounted");
    return () => console.log("MyApp component unmounted");
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
