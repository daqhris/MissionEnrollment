import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPoaps } from '../utils/fetchPoapsUtil';

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
  address: string;
  verifiedName: string;
  onVerified: (hasAttended: boolean) => void;
}

const ETH_GLOBAL_BRUSSELS_EVENT_NAMES = [
  'ETHGlobal Brussels Hacker',
  'ETHGlobal Brussels Sponsor',
  'ETHGlobal Brussels Speaker',
  'ETHGlobal Brussels Mentor',
  'ETHGlobal Brussels Staff',
  'ETHGlobal Brussels Volunteer'
];

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

  useEffect(() => {
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

        if (ethGlobalBrusselsPoap) {
          console.log('Found ETHGlobal Brussels POAP:', ethGlobalBrusselsPoap);
          setPoapDetails(ethGlobalBrusselsPoap);
          setVerificationStatus('success');
          onVerified(true);
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

    verifyEventAttendance();
  }, [address, onVerified]);

  const handleImageError = () => {
    setImageLoadError(true);
  };

  return (
    <div className="card-body">
      <h2 className="text-2xl font-bold mb-4">Event Attendance</h2>
      <p className="text-base-content/70 mb-4">
        Hello {verifiedName}, we're checking your attendance at ETHGlobal Brussels.
      </p>

      {isVerifying && (
        <div className="flex items-center justify-center p-4">
          <span className="loading loading-spinner loading-lg"></span>
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
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p>Event attendance verified!</p>
            <div className="flex items-center mt-2">
              <Image
                src={imageLoadError ? "/placeholder-poap.png" : poapDetails.event.image_url}
                alt={poapDetails.event.name}
                width={50}
                height={50}
                className="rounded-full mr-3"
                onError={handleImageError}
              />
              <div>
                <p className="text-sm font-semibold">{poapDetails.event.name}</p>
                <p className="text-xs">{new Date(poapDetails.event.start_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className={`btn ${verificationStatus === 'success' ? 'btn-secondary' : 'btn-disabled'} mt-4`}
        disabled={verificationStatus !== 'success'}
      >
        NEXT
      </button>
    </div>
  );
};

export default EventAttendanceVerification;
