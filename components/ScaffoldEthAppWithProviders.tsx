"use client";

import { useEffect, useState } from "react";
import { useInitializeNativeCurrencyPrice } from "../hooks/scaffold-eth";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { BlockieAvatar } from "./scaffold-eth";
import { ProgressBar } from "./scaffold-eth/ProgressBar";
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@coinbase/onchainkit/styles.css";
import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { base } from '@wagmi/chains';
import { http } from 'wagmi';
import { OnchainKitProvider } from "@coinbase/onchainkit";
import ErrorBoundary from "./ErrorBoundary";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'MissionEnrollment',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }): JSX.Element => {
  useInitializeNativeCurrencyPrice();

  useEffect(() => {
    console.log('ScaffoldEthApp mounted');
    return () => console.log('ScaffoldEthApp unmounted');
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </ErrorBoundary>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('ScaffoldEthAppWithProviders mounting...');

    try {
      console.log('Initializing basic provider setup...');
      setMounted(true);
      console.log('Component mounted successfully');
    } catch (error) {
      console.error('Error during initialization:', error);
    }

    return () => {
      console.log('ScaffoldEthAppWithProviders unmounting...');
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
          avatar={BlockieAvatar as AvatarComponent}
        >
          <ProgressBar />
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
