import React, { useState, useCallback } from 'react';
import { Address, PublicClient } from 'viem';
import { usePublicClient, useEnsAddress } from 'wagmi';
import { poapABI } from '../poapABI';
import ErrorBoundary from './ErrorBoundary';

const DEBUG_MODE = false; // Disable debug mode

interface POAPEvent {
  event: {
    id: string;
    name: string;
    image_url: string;
    start_date: string;
  };
  token_id: string;
}

interface EventAttendanceVerificationProps {
  userAddress: string;
  onVerified: () => void;
}

const ETH_GLOBAL_BRUSSELS_2024_EVENT_ID = "141";
const POAP_IDS = ["7169394", "7169572", "7169367", "7169352", "7169362"];
const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';

const EventAttendanceVerification: React.FC<EventAttendanceVerificationProps> = ({
  userAddress,
  onVerified
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [proofResult, setProofResult] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const {
    data: resolvedAddress,
    isLoading: isResolvingENS,
    isError: ensResolutionError,
  } = useEnsAddress({
    name: manualAddress || userAddress,
  });

  const isEthGlobalBrusselsPOAP = useCallback((poap: POAPEvent): boolean => {
    if (DEBUG_MODE) console.log(`Checking POAP: ${JSON.stringify(poap)}`);
    if (POAP_IDS.includes(poap.token_id)) return true;

    // Primary check: Match the specific event ID
    if (poap.event.id === ETH_GLOBAL_BRUSSELS_2024_EVENT_ID) {
      return true;
    }

    // Secondary check: Use event details for verification
    const eventDate = new Date(poap.event.start_date);
    const eventName = poap.event.name.toLowerCase();

    const isCorrectName = eventName.includes("ethglobal") &&
                          eventName.includes("brussels") &&
                          eventName.includes("2024");
    const isCorrectYear = eventDate.getFullYear() === 2024;
    const isWithinEventDates = eventDate >= new Date("2024-07-11") &&
                               eventDate <= new Date("2024-07-14");

    const result = isCorrectName && isCorrectYear && isWithinEventDates;
    if (DEBUG_MODE) console.log(`POAP verification result: ${result}`);
    return result;
  }, []);

  const fetchPOAPsBatch = useCallback(async (addressToFetch: Address, startIndex: number, endIndex: number, client: PublicClient): Promise<POAPEvent[]> => {
    if (DEBUG_MODE) console.log(`Fetching POAP batch for address ${addressToFetch}, indices ${startIndex}-${endIndex}`);
    const poaps: POAPEvent[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      try {
        const tokenId = await client.readContract({
          address: POAP_CONTRACT_ADDRESS,
          abi: poapABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [addressToFetch, BigInt(i)]
        });
        if (DEBUG_MODE) console.log(`Token ID for index ${i}: ${tokenId}`);
        if (typeof tokenId !== 'bigint') {
          console.error(`Invalid token ID type for ${addressToFetch} at index ${i}`);
          continue;
        }

        const tokenURI = await client.readContract({
          address: POAP_CONTRACT_ADDRESS,
          abi: poapABI,
          functionName: 'tokenURI',
          args: [tokenId]
        });
        if (DEBUG_MODE) console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
        if (typeof tokenURI !== 'string') {
          console.error(`Invalid token URI for token ID ${tokenId}`);
          continue;
        }

        const response = await fetch(tokenURI);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const metadata = await response.json();
        if (DEBUG_MODE) console.log(`Metadata for token ID ${tokenId}: ${JSON.stringify(metadata)}`);

        const poapEvent: POAPEvent = {
          event: {
            id: tokenId.toString(),
            name: metadata.name || "Unknown Event",
            image_url: metadata.image || "",
            start_date: metadata.attributes?.find((attr: { trait_type: string; value: string }) => attr.trait_type === 'event_date')?.value || '',
          },
          token_id: tokenId.toString(),
        };

        if (isEthGlobalBrusselsPOAP(poapEvent)) {
          poaps.push(poapEvent);
        }
      } catch (error) {
        console.error(`Error processing POAP data for token ${i}:`, error);
        setError(`Error processing POAP data: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      }
    }

    if (DEBUG_MODE) console.log(`Fetched ${poaps.length} POAPs for batch`);
    return poaps;
  }, [isEthGlobalBrusselsPOAP]);
  const fetchPOAPs = useCallback(async (addressToFetch: Address): Promise<void> => {
    if (!publicClient) {
      throw new Error('Public client is not available');
    }

    setIsVerifying(true);
    setProofResult(null);
    setError(null);

    try {
      const balance = await publicClient.readContract({
        address: POAP_CONTRACT_ADDRESS,
        abi: poapABI,
        functionName: 'balanceOf',
        args: [addressToFetch]
      });

      if (typeof balance !== 'bigint' || balance === 0n) {
        setProofResult('No POAPs found for this address');
        return;
      }

      const totalPoaps = Number(balance);
      const batchSize = 10;
      const batches = Math.ceil(totalPoaps / batchSize);

      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, totalPoaps);
        const batchPoaps = await fetchPOAPsBatch(addressToFetch, start, end, publicClient);

        const verifiedPoaps = batchPoaps.filter(poap => POAP_IDS.includes(poap.token_id));
        if (verifiedPoaps.length > 0) {
          setProofResult(`Verified (${verifiedPoaps.length} POAPs found)`);
          onVerified();
          return;
        }

        if (batchPoaps.some(isEthGlobalBrusselsPOAP)) {
          setProofResult('Verified');
          onVerified();
          return;
        }

        // Add a small delay between batches to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProofResult('Not verified');
    } catch (error) {
      console.error('Error fetching POAPs:', error);
      setError(`Error fetching POAPs: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsVerifying(false);
    }
  }, [fetchPOAPsBatch, isEthGlobalBrusselsPOAP, onVerified, publicClient]);

  const handleVerifyAttendance = useCallback((): void => {
    const validAddress = manualAddress || userAddress;
    if (isValidEthereumAddress(validAddress)) {
      setIsVerifying(true);
      if (resolvedAddress) {
        fetchPOAPs(resolvedAddress);
      } else if (!isResolvingENS && !ensResolutionError) {
        fetchPOAPs(validAddress as `0x${string}`);
      } else {
        setProofResult("Error resolving ENS name");
        setIsVerifying(false);
      }
    } else {
      setProofResult("Please enter a valid Ethereum address or ENS name");
    }
  }, [manualAddress, userAddress, fetchPOAPs, isResolvingENS, ensResolutionError, resolvedAddress]);

  const isValidEthereumAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address) || /^[a-zA-Z0-9-]+\.eth$/.test(address);

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Event Attendance Verification</h1>
        <input
          type="text"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="Enter Ethereum address or ENS name"
          className="w-96 px-4 py-2 mb-4 border rounded"
        />
        <button
          onClick={handleVerifyAttendance}
          disabled={isVerifying}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isVerifying ? 'Verifying...' : 'Verify Attendance'}
        </button>
        {proofResult && (
          <p className={`mt-4 ${proofResult === 'Verified' ? 'text-green-600' : 'text-red-600'}`}>
            {proofResult}
          </p>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(EventAttendanceVerification);
