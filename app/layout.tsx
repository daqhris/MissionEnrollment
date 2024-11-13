import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import "@coinbase/onchainkit/styles.css";
import StyledComponentsRegistry from "~~/app/registry";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { Footer } from "~~/components/Footer";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "~~/services/apollo/apolloClient";

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
              <ApolloProvider client={apolloClient}>
                {children}
                <Footer />
              </ApolloProvider>
            </StyledComponentsRegistry>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
