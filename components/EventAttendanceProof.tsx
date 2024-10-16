import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

  const fetchPoaps = useCallback(async () => {
    if (!userAddress) {
      setError("Please connect your wallet to verify attendance.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching POAPs for address:", userAddress);
      const response = await axios.get(`/api/fetchPoaps?address=${userAddress}`);
      console.log("API response:", response.data);
      const fetchedPoaps = response.data.poaps;
      console.log("Fetched POAPs:", fetchedPoaps);
      setPoaps(fetchedPoaps);
      if (fetchedPoaps.length > 0) {
        console.log("Searching for ETHGlobal Brussels 2024 POAP");
        const ethGlobalBrusselsPOAP = fetchedPoaps.find(
          (poap: Poap) => poap.event.name.toLowerCase() === "ethglobal brussels 2024",
        );
        console.log("ETHGlobal Brussels 2024 POAP found:", ethGlobalBrusselsPOAP);
        if (ethGlobalBrusselsPOAP) {
          onVerified();
          toast.success("ETHGlobal Brussels 2024 POAP verified successfully!");
        } else {
          console.log("ETHGlobal Brussels 2024 POAP not found");
          toast.warning(
            "You have POAPs, but none from ETHGlobal Brussels 2024. Please make sure you've claimed the correct POAP.",
          );
        }
      } else {
        console.log("No POAPs found for the address");
        toast.info(
          "No POAPs found for this address. Make sure you've claimed your ETHGlobal Brussels 2024 POAP and try again.",
        );
      }
    } catch (err) {
      console.error("Error fetching POAPs:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("API error response:", err.response.data);
          toast.error(`Failed to fetch POAPs: ${err.response.data.error || "Unknown error"}. Please try again later.`);
        } else if (err.request) {
          console.error("Network error:", err.request);
          toast.error("Network error. Please check your internet connection and try again.");
        } else {
          console.error("Unexpected error:", err.message);
          toast.error("An unexpected error occurred. Please try again later or contact support if the issue persists.");
        }
      } else {
        console.error("Non-Axios error:", err);
        toast.error("Failed to fetch POAPs. Please try again later or contact support if the issue persists.");
      }
    } finally {
      setLoading(false);
    }
  }, [userAddress, setPoaps, onVerified]);

  useEffect(() => {
    if (userAddress) {
      fetchPoaps();
    }
  }, [userAddress, fetchPoaps]);

  return (
    <div className="event-attendance-proof text-center">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Proof</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <p className="ml-2">Loading POAPs...</p>
        </div>
      ) : error ? (
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={fetchPoaps}
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
            onClick={fetchPoaps}
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
