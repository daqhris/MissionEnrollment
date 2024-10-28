import React from "react";
import "./styles.css";
import ClientLayout from "./components/ClientLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mission Enrollment",
  description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout;
