import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchAndVerifyPOAPs, POAPEvent } from "../utils/poapUtils";

interface EventAttendanceProofProps {
  onVerified: () => void;
  setPoaps: (poaps: POAPEvent[]) => void;
  userAddress: string | undefined;
}

const EventAttendanceProof: React.FC<EventAttendanceProofProps> = ({ onVerified, setPoaps, userAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [verificationStarted, setVerificationStarted] = useState<boolean>(false);

  // 5-minute delay implementation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (verificationStarted && progress < 100) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (1/300) * 100; // 5 minutes = 300 seconds
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [verificationStarted, progress]);

  useEffect(() => {
    if (progress === 100) {
      verifyPOAPs();
    }
  }, [progress, verifyPOAPs]);

  const verifyPOAPs = useCallback(async () => {
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

      setPoaps(poaps);

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
      setVerificationStarted(false);
      setProgress(0);
    }
  }, [userAddress, onVerified, setPoaps]);

  const startVerification = () => {
    setVerificationStarted(true);
    setProgress(0);
  };

  return (
    <div className="event-attendance-proof text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Event Attendance Proof</h2>
      {loading ? (
        <div className="flex justify-center items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-3">Verifying POAPs...</p>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={startVerification}
            disabled={loading}
          >
            Retry Verification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p>Click the button below to verify your ETHGlobal Brussels 2024 POAP.</p>
          {verificationStarted ? (
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin" style={{ borderRightColor: 'transparent', animationDuration: '2s' }}></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Verification in progress... {Math.round(progress)}%
              </p>
              <p className="text-xs text-gray-500">
                Estimated time remaining: {Math.ceil((100 - progress) * 3)} seconds
              </p>
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={startVerification}
              disabled={loading}
            >
              Verify Attendance
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventAttendanceProof;
