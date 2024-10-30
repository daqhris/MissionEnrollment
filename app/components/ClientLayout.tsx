import { useEffect, useState } from 'react';
import { validateEnv } from '../config/env';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('../providers'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeProviders = async () => {
      try {
        console.log('[ClientLayout] Validating environment...');
        validateEnv();
        console.log('[ClientLayout] Environment validated, initializing providers...');
        setIsReady(true);
      } catch (error) {
        console.error('[ClientLayout] Failed to initialize providers:', error);
      }
    };

    initializeProviders();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <Providers>{children}</Providers>;
}