import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPoaps } from '../utils/fetchPoapsUtil';
import { APPROVED_EVENT_NAMES, EVENT_VENUES } from '../utils/eventConstants';
import { useNetworkSwitch } from '../hooks/useNetworkSwitch';
import { extractRoleFromPOAP, determineEventType } from '../utils/roleExtraction';

const getRoleBadgeColor = (role: string): string => {
  switch(role.toLowerCase()) {
    case 'hacker':
      return 'bg-blue-100 text-blue-800';
    case 'mentor':
      return 'bg-green-100 text-green-800';
    case 'judge':
      return 'bg-purple-100 text-purple-800';
    case 'sponsor':
      return 'bg-yellow-100 text-yellow-800';
    case 'speaker':
      return 'bg-red-100 text-red-800';
    case 'staff':
      return 'bg-gray-100 text-gray-800';
    case 'volunteer':
      return 'bg-teal-100 text-teal-800';
    case 'developer':
      return 'bg-indigo-100 text-indigo-800';
    case 'social participant':
      return 'bg-pink-100 text-pink-800';
    case 'buidler':
      return 'bg-orange-100 text-orange-800';
    case 'attendee':
      return 'bg-amber-100 text-amber-800';
    case 'participant':
      return 'bg-lime-100 text-lime-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface POAPEvent {
  event: {
    id: number;
    name: string;
    image_url: string;
    start_date: string;
    end_date?: string;  // Make end_date optional since it might not always be present
    description?: string; // Make description optional since it might not always be present
  };
  tokenId: string;
}

interface EventInfo {
  role: string;
  date: string;
  venue: string;
  approvedName: string;
  tokenId: string;
  eventType: string; // Added to identify which event the user attended
}

interface EventAttendanceVerificationProps {
  address: string;
  approvedName: string;
  onVerified: (hasAttended: boolean, eventInfo?: EventInfo) => void;
  attestationId?: string | null;
}

const EventAttendanceVerification: React.FC<EventAttendanceVerificationProps> = ({
  address,
  approvedName,
  onVerified,
  attestationId
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [error, setError] = useState<string | null>(null);
  const [poapDetails, setPoapDetails] = useState<POAPEvent | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [attendedEvent, setAttendedEvent] = useState<boolean | null>(null);

  const {
    isLoading: isNetworkSwitching,
    error: networkError,
    networkSwitched,
    handleNetworkSwitch,
    targetNetwork
  } = useNetworkSwitch('attestation');

  const verifyEventAttendance = async () => {
    if (!address) return;

    setIsVerifying(true);
    setError(null);

    try {
      console.log('Fetching POAPs for address:', address);
      const poaps = await fetchPoaps(address);
      console.log('Fetched POAPs:', poaps);

      let eventPoap = null;
      let eventType = '';

      eventPoap = poaps.find(poap =>
        APPROVED_EVENT_NAMES.ETH_GLOBAL_BRUSSELS.some(eventName =>
          poap.event.name.toLowerCase().includes(eventName.toLowerCase())
        )
      );
      if (eventPoap) {
        eventType = 'ETH_GLOBAL_BRUSSELS';
        console.log('Found ETHGlobal Brussels POAP:', eventPoap);
      }

      if (!eventPoap) {
        eventPoap = poaps.find(poap =>
          APPROVED_EVENT_NAMES.ETHDENVER_COINBASE_2025.some(eventName =>
            poap.event.name.toLowerCase().includes(eventName.toLowerCase())
          )
        );
        if (eventPoap) {
          eventType = 'ETHDENVER_COINBASE_2025';
          console.log('Found ETHDenver Coinbase 2025 POAP:', eventPoap);
        }
      }

      // Add a minimum delay for the drumroll effect (15 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      if (eventPoap) {
        setPoapDetails(eventPoap);
        setVerificationStatus('success');

        // Extract role using the centralized utility
        const role = extractRoleFromPOAP(
          eventPoap.event.name,
          eventPoap.event.description || '',
          eventType
        );

        // Combine approved name and POAP info for attestation
        const eventInfo: EventInfo = {
          role,
          date: eventPoap.event.end_date || eventPoap.event.start_date,
          venue: EVENT_VENUES[eventType as keyof typeof EVENT_VENUES],
          approvedName: approvedName,
          tokenId: eventPoap.tokenId,
          eventType: eventType
        };

        onVerified(true, eventInfo);
      } else {
        console.log('No approved event POAP found');
        setVerificationStatus('error');
        setError('No approved event attendance record found');
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
    <div className="card">
      <div className="card-body">
        <h2 className="text-2xl font-bold mb-4">Approved Event Attendance</h2>

        {!hasAnswered ? (
          <div className="text-center">
            <p className="text-base-content/70 mb-6">
              Hello {approvedName}, did you attend any of our approved events in person? This verification is required for enrolling in the Zinneke Rescue Mission.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className={`btn btn-primary ${attestationId ? 'btn-disabled opacity-50' : ''}`}
                onClick={() => handleAttendanceResponse(true)}
                disabled={!!attestationId}
                id="yes-attended-button"
              >
                Yes, I attended
              </button>
              <button
                className={`btn btn-outline ${attestationId ? 'btn-disabled opacity-50' : ''}`}
                onClick={() => handleAttendanceResponse(false)}
                disabled={!!attestationId}
                id="no-attended-button"
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
              <p className="text-sm">The enrollment process requires in-person attendance at one of our approved events. We hope to see you at future events!</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-base-content/70 mb-4">
              Hello {approvedName}, we are checking your attendance at our approved events.
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
                  <p className="animate-pulse">🎪 Looking for approved event badges</p>
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
                    <p className="font-bold text-lg">🎉 Event attendance approved!</p>
                    <p className="text-sm opacity-75 font-medium" style={{ color: '#B8860B' }}>Your POAP confirms your participation at an approved blockchain event</p>
                  </div>
                  <div className="flex items-center bg-base-200 rounded-lg p-4">
                    <Image
                      src={imageLoadError ? "/placeholder-poap.png" : poapDetails?.event?.image_url}
                      alt={poapDetails?.event?.name || 'POAP Image'}
                      width={128}
                      height={128}
                      className="rounded-full mr-4 border-4 border-primary"
                      onError={handleImageError}
                    />
                    <div className="space-y-2">
                      <p className="text-base font-semibold">
                        {poapDetails?.event?.name?.includes('ETHGlobal Brussels') ? 'ETHGlobal Brussels 2024' : 
                         poapDetails?.event?.name?.includes('Coinbase Developer Platform') ? 'ETHDenver Coinbase 2025' : 
                         'Approved Event'}
                      </p>
                      <div className="flex flex-col text-sm opacity-75">
                        <p className="flex items-center">
                        <span>🎭 Role: </span>
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          getRoleBadgeColor(extractRoleFromPOAP(
                            poapDetails?.event?.name || '',
                            poapDetails?.event?.description || '',
                            poapDetails?.event?.name?.includes('ETHGlobal Brussels') ? 'ETH_GLOBAL_BRUSSELS' : 'ETHDENVER_COINBASE_2025'
                          ))
                        }`}>
                          {extractRoleFromPOAP(
                            poapDetails?.event?.name || '',
                            poapDetails?.event?.description || '',
                            poapDetails?.event?.name?.includes('ETHGlobal Brussels') ? 'ETH_GLOBAL_BRUSSELS' : 'ETHDENVER_COINBASE_2025'
                          )}
                        </span>
                      </p>
                        <p>📅 Date: {new Date(poapDetails?.event?.end_date || poapDetails?.event?.start_date || Date.now()).toLocaleDateString()}</p>
                        <p>📍 Venue: {poapDetails?.event?.name?.includes('ETHGlobal Brussels') ? 
                          EVENT_VENUES.ETH_GLOBAL_BRUSSELS : 
                          EVENT_VENUES.ETHDENVER_COINBASE_2025}</p>
                        <p>🎫 Token ID: {poapDetails?.tokenId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <button
                className={`btn w-full ${networkSwitched || attestationId ? 'btn-disabled opacity-50' : 'btn-primary'}`}
                onClick={async () => {
                  const success = await handleNetworkSwitch();
                  if (success && poapDetails) {
                    const eventType = poapDetails.event.name.includes('ETHGlobal Brussels') 
                      ? 'ETH_GLOBAL_BRUSSELS' 
                      : 'ETHDENVER_COINBASE_2025';
                    
                    // Extract role using the centralized utility
                    const role = extractRoleFromPOAP(
                      poapDetails.event.name,
                      poapDetails.event.description || '',
                      eventType
                    );
                    
                    onVerified(true, {
                      role,
                      date: poapDetails.event.end_date || poapDetails.event.start_date,
                      venue: EVENT_VENUES[eventType as keyof typeof EVENT_VENUES],
                      approvedName: approvedName,
                      tokenId: poapDetails.tokenId,
                      eventType
                    });
                  }
                }}
                disabled={networkSwitched || verificationStatus !== 'success' || !!attestationId}
                id="switch-network-button"
              >
                {isNetworkSwitching ? 'Switching Network...' :
                 networkSwitched ? 'Network Switched' : 'Switch to Base Sepolia'}
              </button>
              <p className="text-sm text-center mt-2 text-base-content/70">
                Base Sepolia required for attestation creation
              </p>
              {networkError && (
                <p className="text-sm text-center mt-2 text-error">
                  {networkError}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventAttendanceVerification;
