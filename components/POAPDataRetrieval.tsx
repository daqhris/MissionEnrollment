import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchAndVerifyPOAPs, POAPEvent } from '../utils/poapUtils';
import { toast } from 'react-toastify';

interface POAPDataRetrievalProps {
  userAddress: string;
}

const POAPDataRetrieval: React.FC<POAPDataRetrievalProps> = ({ userAddress }) => {
  const [poaps, setPoaps] = useState<POAPEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOAPs = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const { poaps: fetchedPoaps } = await fetchAndVerifyPOAPs(userAddress);
        setPoaps(fetchedPoaps);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching POAP data:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (userAddress) {
      fetchPOAPs();
    }
  }, [userAddress]);

  return (
    <div className="poap-data-retrieval">
      {isLoading && (
        <div className="loading-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading POAPs...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {poaps.length > 0 && (
        <div className="poaps-display">
          <h3 className="text-xl font-semibold mb-4">Your POAPs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {poaps.map((poap) => (
              <div key={poap.token_id} className="poap-card bg-gray-800 rounded-lg p-4 shadow-lg">
                <h4 className="text-lg font-medium mb-2">{poap.event.name}</h4>
                {poap.metadata?.image && (
                  <div className="relative h-48 w-full mb-2">
                    <Image
                      src={poap.metadata.image}
                      alt={poap.event.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = poap.event.image_url;
                      }}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400">
                  Date: {new Date(poap.event.start_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && poaps.length === 0 && (
        <div className="no-poaps-state">
          <p className="text-gray-400">No POAPs found for this address.</p>
        </div>
      )}
    </div>
  );
};

export default POAPDataRetrieval;
