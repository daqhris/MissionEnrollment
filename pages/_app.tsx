import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from '../services/web3/wagmiConfig';
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../services/apollo/apolloClient";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default MyApp;
