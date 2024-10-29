'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WalletErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    logger.error('WalletErrorBoundary', 'Error caught in getDerivedStateFromError', error);
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const details = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    };
    logger.error('WalletErrorBoundary', 'Uncaught error in component', details);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 rounded-lg shadow-md bg-red-50">
            <div className="text-lg font-semibold mb-2 text-red-600">
              Wallet Connection Error
            </div>
            <div className="text-sm text-red-500">
              {this.state.error?.message || 'An error occurred while connecting to your wallet'}
            </div>
            <button
              onClick={() => {
                logger.info('WalletErrorBoundary', 'Attempting to recover from error');
                this.setState({ hasError: false, error: null });
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
