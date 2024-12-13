import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import "@coinbase/onchainkit/styles.css";
import StyledComponentsRegistry from "./registry";
import { ScaffoldEthAppWithProviders } from "../components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "../components/ThemeProvider";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import "../styles/globals.css";
import { getMetadata } from "../utils/scaffold-eth/getMetadata";
import { ClientApolloProvider } from "../components/ClientApolloProvider";
import { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = getMetadata({
  title: "Mission Enrollment",
  description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ScaffoldEthAppWithProviders>
            <StyledComponentsRegistry>
              <ClientApolloProvider>
                <Header />
                {children}
                <Footer />
              </ClientApolloProvider>
            </StyledComponentsRegistry>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
