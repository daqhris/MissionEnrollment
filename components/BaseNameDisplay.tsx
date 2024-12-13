'use client';

import { useState, useEffect } from 'react';
import { getBaseName } from '../utils/basename';

interface BaseNameDisplayProps {
  address: string;
  showLabel?: boolean;
  className?: string;
}

export function BaseNameDisplay({ address, showLabel = true, className = '' }: BaseNameDisplayProps) {
  const [baseName, setBaseName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBaseName() {
      try {
        const name = await getBaseName(address);
        setBaseName(name || null);
      } catch (error) {
        console.error('Error fetching Base name:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBaseName();
  }, [address]);

  if (loading) {
    return <span className={className}>{showLabel ? 'Loading...' : address}</span>;
  }

  return (
    <span className={className}>
      {showLabel && 'Attester: '}{baseName || address}
      {baseName && <span className="text-sm text-gray-500 ml-2">({address})</span>}
    </span>
  );
}
