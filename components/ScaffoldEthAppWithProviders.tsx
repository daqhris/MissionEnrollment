"use client";

import { useEffect, useState } from "react";
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia } from 'viem/chains';
import { http } from 'wagmi';

import { useInitializeNativeCurrencyPrice } from "../hooks/scaffold-eth";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { BlockieAvatar } from "./scaffold-eth";
import { ProgressBar } from "./scaffold-eth/ProgressBar";
import ErrorBoundary from "./ErrorBoundary";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'MissionEnrollment',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [baseSepolia], // Temporarily use only Base Sepolia for testing
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
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
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('ScaffoldEthAppWithProviders mounting...');
    try {
      console.log('Initializing minimal setup...');
      setMounted(true);
      console.log('Minimal setup complete');
    } catch (err) {
      console.error('Error during initialization:', err);
      setError(err as Error);
    }
    return () => {
      console.log('ScaffoldEthAppWithProviders unmounting...');
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Initialization Error</h2>
          <pre className="text-sm">{error.message}</pre>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Return minimal setup for testing
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="relative flex flex-col flex-1">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};
