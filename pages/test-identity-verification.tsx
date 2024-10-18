import React from 'react';
import dynamic from 'next/dynamic';

const IdentityVerification = dynamic(() => import('../components/IdentityVerification'), {
  ssr: false,
  loading: () => <p>Loading IdentityVerification component...</p>
});

const TestIdentityVerification: React.FC = (): React.ReactElement => {
  const handleVerified = (address: string, name: string): void => {
    console.log(`Verified: Address ${address}, Name ${name}`);
  };

  return (
    <div>
      <h1>Test Identity Verification</h1>
      <IdentityVerification onVerified={handleVerified} />
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    console.error('Error caught in getDerivedStateFromError:', error);
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please check the console for more information.</h1>;
    }

    return this.props.children;
  }
}

export default function WrappedTestIdentityVerification(): React.ReactElement {
  return (
    <ErrorBoundary>
      <TestIdentityVerification />
    </ErrorBoundary>
  );
}
