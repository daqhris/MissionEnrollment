import React from "react";
import "@coinbase/onchainkit/styles.css";
import { AppProvider } from "~~/app/providers/AppProvider";
import "~~/styles/globals.css";

export const metadata = {
  title: "Mission Enrollment",
  description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
};

const RootLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html suppressHydrationWarning>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
