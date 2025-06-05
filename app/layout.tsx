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
import { JsonLd } from "../components/JsonLd";
import { getStructuredData } from "../utils/seo/getStructuredData";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.8,
  maximumScale: 5,
};

export const metadata = getMetadata({
  title: "Mission Enrollment | Gateway to the Zinneke Rescue Mission",
  description: "Join the Zinneke Rescue Mission by verifying your blockchain identity and event attendance. A collaborative project by human and AI creators.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <JsonLd data={getStructuredData()} />
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
