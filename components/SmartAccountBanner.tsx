'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { isSmartAccountSupported } from '../app/config/smartWallets';
import { ExternalLinkIcon } from './ExternalLinkIcon';

export default function SmartAccountBanner() {
  const { isConnected } = useAccount();
  const [isSmartAccountEnabled, setIsSmartAccountEnabled] = useState(false);

  useEffect(() => {
    const checkSmartAccountSupport = async () => {
      const supported = isSmartAccountSupported();
      setIsSmartAccountEnabled(supported);
    };

    checkSmartAccountSupport();
  }, []);

  if (!isConnected || !isSmartAccountEnabled) {
    return null;
  }

  return (
    <div className="w-full bg-amber-100 border-t border-b border-amber-200 p-3 sm:p-4 text-amber-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">Account Abstraction Available</h3>
            <p className="mt-1 text-xs sm:text-sm text-amber-700">
              Smart accounts with gasless transactions are now available on Base. Create attestations without paying gas fees.
            </p>
          </div>
        </div>
        <a
          href="https://www.alchemy.com/docs/account-abstraction-overview"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 sm:mt-0 inline-flex items-center px-3 py-1.5 border border-amber-600 text-xs font-medium rounded-md text-amber-800 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Learn More
          <ExternalLinkIcon className="ml-1.5" />
        </a>
      </div>
    </div>
  );
}
