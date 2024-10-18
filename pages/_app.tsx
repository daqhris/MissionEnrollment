import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from '../services/web3/wagmiConfig';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../services/apollo/apolloClient';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  console.log("Rendering MyApp component");

  React.useEffect(() => {
    console.log("MyApp component mounted");
    return () => console.log("MyApp component unmounted");
  }, []);

  try {
    console.log("Initializing WagmiConfig");
    console.log("wagmiConfig:", JSON.stringify(wagmiConfig, null, 2));
    console.log("chains:", JSON.stringify(chains, null, 2));
    console.log("apolloClient:", apolloClient);

    const wagmiConfigComponent = (
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    );
    console.log("WagmiConfig initialized successfully");
    return wagmiConfigComponent;
  } catch (error) {
    console.error("Error in MyApp component:", error);
    return <div>An error occurred. Please check the console for more details.</div>;
  }
}

export default MyApp;
