import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from '../services/web3/wagmiConfig';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
