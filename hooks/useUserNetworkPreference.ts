import { useState, useEffect } from 'react';
import { BASE_SEPOLIA_CHAIN_ID } from '../utils/constants';

const USER_NETWORK_PREFERENCE_KEY = 'mission-enrollment-network-preference';

export const useUserNetworkPreference = () => {
  const [preferredNetwork, setPreferredNetworkState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPreference = localStorage.getItem(USER_NETWORK_PREFERENCE_KEY);
    if (storedPreference) {
      try {
        setPreferredNetworkState(parseInt(storedPreference));
      } catch (e) {
        console.error('Failed to parse stored network preference', e);
        setPreferredNetworkState(BASE_SEPOLIA_CHAIN_ID); // Default to Sepolia
      }
    } else {
      setPreferredNetworkState(BASE_SEPOLIA_CHAIN_ID); // Default to Sepolia
    }
    setIsLoading(false);
  }, []);

  const setPreferredNetwork = (network: number) => {
    setPreferredNetworkState(network);
    localStorage.setItem(USER_NETWORK_PREFERENCE_KEY, network.toString());
  };

  return {
    preferredNetwork: preferredNetwork || BASE_SEPOLIA_CHAIN_ID,
    setPreferredNetwork,
    isLoading
  };
};
