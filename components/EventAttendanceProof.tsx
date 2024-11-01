import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { fetchAndVerifyPOAPs, POAPEvent } from "../utils/poapUtils";

interface Poap {
  event: {
    name: string;
    description: string;
  };
  imageUrl: string;
}

interface EventAttendanceProofProps {
  onVerified: () => void;
  setPoaps: (poaps: Poap[]) => void;
  userAddress: string | undefined;
}

const EventAttendanceProof: React.FC<EventAttendanceProofProps> = ({ onVerified, setPoaps, userAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyAttendance = useCallback(async () => {
    if (!userAddress) {
      setError("Please connect your wallet to verify attendance.");
      toast.error("Please connect your wallet to verify attendance.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Starting POAP verification for address:", userAddress);
      const { poaps, hasEthGlobalBrussels } = await fetchAndVerifyPOAPs(userAddress);

      console.log("POAP verification completed:", {
        totalPoaps: poaps.length,
        hasEthGlobalBrussels
      });

      // Convert POAPEvent[] to Poap[] to match the expected type
      const convertedPoaps: Poap[] = poaps.map(poap => ({
        event: {
          name: poap.event.name,
          description: poap.event.description || ''
        },
        imageUrl: poap.metadata?.image || poap.event.image_url
      }));

      setPoaps(convertedPoaps);

      if (hasEthGlobalBrussels) {
        onVerified();
        toast.success("ETHGlobal Brussels 2024 POAP verified successfully!");
      } else if (poaps.length > 0) {
        toast.warning(
          "You have POAPs, but none from ETHGlobal Brussels 2024. Please make sure you've claimed the correct POAP."
        );
      } else {
        toast.info(
          "No POAPs found for this address. Make sure you've claimed your ETHGlobal Brussels 2024 POAP and try again."
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error during POAP verification:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userAddress, setPoaps, onVerified]);

  return (
    <div className="event-attendance-proof text-center">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Proof</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <p className="ml-2">Verifying POAPs...</p>
        </div>
      ) : error ? (
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={verifyAttendance}
            disabled={loading}
          >
            Retry Verification
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">Click the button below to verify your ETHGlobal Brussels 2024 POAP.</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={verifyAttendance}
            disabled={loading}
          >
            Verify Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default EventAttendanceProof;
