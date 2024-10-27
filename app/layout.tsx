import React from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";
import "~~/styles/globals.css";

export const metadata = {
  title: "Mission Enrollment",
  description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
};

const RootLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  // Ensure environment variables are available and handle missing values
  const cdpApiKey = process.env.NEXT_PUBLIC_CDP_API_KEY;
  const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  // Log warning if environment variables are missing
  if (!cdpApiKey) {
    console.warn("Missing CDP API key environment variable");
  }
  if (!wcProjectId) {
    console.warn("Missing WalletConnect Project ID environment variable");
  }

  return (
    <html suppressHydrationWarning>
      <body>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <OnchainKitProvider
              apiKey={cdpApiKey ?? ""}
              chain={base}
              projectId={wcProjectId ?? ""}
            >
              {children}
            </OnchainKitProvider>
          </ErrorBoundary>
        </React.Suspense>
      </body>
    </html>
  );
};

// Error boundary component for better error handling
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in OnchainKit provider:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

export default RootLayout;
