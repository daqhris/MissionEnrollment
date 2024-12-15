import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPoaps } from '../utils/fetchPoapsUtil';
import { ETH_GLOBAL_BRUSSELS_EVENT_NAMES, EVENT_VENUE } from '../utils/eventConstants';

interface POAPEvent {
  event: {
    id: number;
    name: string;
    image_url: string;
    start_date: string;
    end_date?: string;  // Make end_date optional since it might not always be present
  };
  tokenId: string;
}

interface EventInfo {
  role: string;
  date: string;
  venue: string;
  verifiedName: string;
  tokenId: string;
}

interface EventAttendanceVerificationProps {
  address: string;
  verifiedName: string;
  onVerified: (hasAttended: boolean, eventInfo?: EventInfo) => void;
}

const EventAttendanceVerification: React.FC<EventAttendanceVerificationProps> = ({
  address,
  verifiedName,
  onVerified
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [error, setError] = useState<string | null>(null);
  const [poapDetails, setPoapDetails] = useState<POAPEvent | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [attendedEvent, setAttendedEvent] = useState<boolean | null>(null);

  const verifyEventAttendance = async () => {
    if (!address) return;

    setIsVerifying(true);
    setError(null);

    try {
      console.log('Fetching POAPs for address:', address);
      const poaps = await fetchPoaps(address);
      console.log('Fetched POAPs:', poaps);

      const ethGlobalBrusselsPoap = poaps.find(poap =>
        ETH_GLOBAL_BRUSSELS_EVENT_NAMES.some(eventName =>
          poap.event.name.toLowerCase().includes(eventName.toLowerCase())
        )
      );

      // Add a minimum delay for the drumroll effect (15 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));
      if (ethGlobalBrusselsPoap) {
        console.log('Found ETHGlobal Brussels POAP:', ethGlobalBrusselsPoap);
        setPoapDetails(ethGlobalBrusselsPoap);
        setVerificationStatus('success');

        // Extract role from POAP name (e.g., "ETHGlobal Brussels Hacker" -> "Hacker")
        const role = ethGlobalBrusselsPoap.event.name
          .replace('ETHGlobal Brussels ', '')
          .trim();

        // Combine verified name and POAP info for attestation
        const eventInfo: EventInfo = {
          role,
          date: ethGlobalBrusselsPoap.event.end_date || ethGlobalBrusselsPoap.event.start_date,
          venue: EVENT_VENUE,
          verifiedName: verifiedName,
          tokenId: ethGlobalBrusselsPoap.tokenId
        };

        onVerified(true, eventInfo);
      } else {
        console.log('No ETHGlobal Brussels POAP found');
        setVerificationStatus('error');
        setError('No ETHGlobal Brussels attendance record found');
        onVerified(false);
      }
    } catch (error) {
      console.error('Error verifying event attendance:', error);
      setVerificationStatus('error');
      setError('Failed to verify event attendance. Please try again.');
      onVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAttendanceResponse = (attended: boolean) => {
    setHasAnswered(true);
    setAttendedEvent(attended);
    if (attended) {
      verifyEventAttendance();
    } else {
      onVerified(false);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  return (
    <div className="card-body">
      <h2 className="text-2xl font-bold mb-4">Event Attendance</h2>

      {!hasAnswered ? (
        <div className="text-center">
          <p className="text-base-content/70 mb-6">
            Hello {verifiedName}, did you attend ETHGlobal Brussels in person?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => handleAttendanceResponse(true)}
            >
              Yes, I attended
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleAttendanceResponse(false)}
            >
                No, I did not attend
              </button>
            </div>
          </div>
        ) : attendedEvent === false ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p>Thank you for your honesty!</p>
              <p className="text-sm">The enrollment process requires in-person attendance at ETHGlobal Brussels. We hope to see you at future events!</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-base-content/70 mb-4">
              Hello {verifiedName}, we are checking your attendance at ETHGlobal Brussels.
          </p>

          {isVerifying && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="loading loading-ring loading-lg absolute inset-0 animate-ping"></span>
              </div>
              <p className="text-base-content/70 animate-pulse text-lg font-semibold">
                🎭 Verifying your attendance...
              </p>
              <div className="flex flex-col items-center space-y-2 text-sm text-base-content/50">
                <p className="animate-bounce">🔍 Searching POAPs on Gnosis Chain</p>
                <p className="animate-pulse">🎪 Looking for ETHGlobal Brussels badges</p>
                <p>🎯 Matching your wallet address</p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {verificationStatus === 'success' && poapDetails && (
            <div className="alert alert-success mb-4 transition-all duration-500 ease-in-out transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-lg">🎉 Event attendance verified!</p>
                  <p className="text-sm opacity-75">Your POAP confirms your participation at a hackathon in Brussels hosted by ETHGlobal</p>
                </div>
                <div className="flex items-center bg-base-200 rounded-lg p-4">
                  <Image
                    src={imageLoadError ? "/placeholder-poap.png" : poapDetails.event.image_url}
                    alt={poapDetails.event.name}
                    width={128}
                    height={128}
                    className="rounded-full mr-4 border-4 border-primary"
                    onError={handleImageError}
                  />
                  <div className="space-y-2">
                    <p className="text-base font-semibold">ETHGlobal Brussels 2024</p>
                    <div className="flex flex-col text-sm opacity-75">
                      <p>🎭 Role: {poapDetails.event.name.replace('ETHGlobal Brussels 2024', '')}</p>
                      <p>📅 Date: {new Date(poapDetails.event.end_date || poapDetails.event.start_date).toLocaleDateString()}</p>
                      <p>📍 Venue: {EVENT_VENUE}</p>
                      <p>🎫 Token ID: {poapDetails.tokenId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className={`btn ${verificationStatus === 'success' ? 'btn-primary' : 'btn-disabled'} mt-4 w-full`}
            disabled={verificationStatus !== 'success'}
          >
            CONTINUE
          </button>
        </>
      )}
    </div>
  );
};

export default EventAttendanceVerification;
