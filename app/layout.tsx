import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "~~/app/providers/RainbowKitProvider";
import "~~/styles/globals.css";

export const metadata = {
  title: "Mission Enrollment",
  description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
};

const RootLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html suppressHydrationWarning>
      <body>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </body>
    </html>
  );
};

export default RootLayout;
