"use client";

import { useEffect, useState } from "react";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { BlockieAvatar } from "./scaffold-eth";
import { ProgressBar } from "./scaffold-eth/ProgressBar";
import { useInitializeNativeCurrencyPrice } from "../hooks/scaffold-eth";
import { config } from "../app/config/wagmi";
import ErrorBoundary from "./ErrorBoundary";
import { NEXT_PUBLIC_ONCHAINKIT_API_KEY } from "../app/config/env";
import { OnboardingProvider } from "./Onboarding";

import "@rainbow-me/rainbowkit/styles.css";
import "@coinbase/onchainkit/styles.css";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </ErrorBoundary>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <OnchainKitProvider
            apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
            chain={config.chains[0]}
          >
            <RainbowKitProvider
              avatar={BlockieAvatar}
              theme={isDarkMode ? darkTheme() : lightTheme()}
              appInfo={{
                appName: 'Mission Enrollment',
              }}
            >
              <OnboardingProvider>
                <ScaffoldEthApp>{children}</ScaffoldEthApp>
              </OnboardingProvider>
            </RainbowKitProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
};
