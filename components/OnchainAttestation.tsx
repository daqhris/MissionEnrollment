import React, { useState, useEffect } from "react";
import type { WalletClient } from "viem";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';

interface PoapEvent {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
}

interface Poap {
  event: PoapEvent;
  token_id: string;
}

// This component uses the Ethereum Attestation Service (EAS) protocol
// to create attestations on both Base and Optimism rollups

const EAS_CONTRACT_ADDRESS: Record<string, `0x${string}`> = {
  base: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
  optimism: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"
};
const SCHEMA_UID: `0x${string}` = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd"; // Actual schema UID for mission enrollment
const ATTESTER_ADDRESS: `0x${string}` = "0xF0bC5CC2B4866dAAeCb069430c60b24520077037"; // Actual address of daqhris.eth
const ATTESTER_NAME = "mission-enrollment.daqhris.eth";

interface OnchainAttestationProps {
  onAttestationComplete: () => void;
  poaps: Poap[];
}

const OnchainAttestation: React.FC<OnchainAttestationProps> = ({
  onAttestationComplete,
  poaps
}): JSX.Element => {
  const [isAttesting, setIsAttesting] = useState<boolean>(false);
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);
  const [selectedRollup, setSelectedRollup] = useState<"base" | "optimism">("base");
  const [eas, setEAS] = useState<EAS | null>(null);

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!address || !walletClient || !publicClient) {
      setAttestationStatus('Please connect your wallet to continue.');
    } else {
      setAttestationStatus(null);
    }
  }, [address, walletClient, publicClient]);

const initializeEAS = async (
  walletClient: WalletClient,
  setEAS: React.Dispatch<React.SetStateAction<EAS | null>>,
  setAttestationStatus: React.Dispatch<React.SetStateAction<string | null>>,
  selectedRollup: "base" | "optimism"
): Promise<void> => {
  if (!walletClient) {
    setAttestationStatus('Wallet client not available. Please connect your wallet.');
    return;
  }
  try {
    const easInstance = new EAS(EAS_CONTRACT_ADDRESS[selectedRollup] as `0x${string}`);

    if (!('signTypedData' in walletClient)) {
      throw new Error("Wallet client does not support signing typed data");
    }

    // Create a TransactionSigner from the WalletClient
    const signer = {
      signTypedData: walletClient.signTypedData,
      getAddress: async (): Promise<`0x${string}`> => walletClient.account?.address ?? '0x',
      signMessage: walletClient.signMessage,
    };

    await easInstance.connect(signer);

    setEAS(easInstance);
    setAttestationStatus(`EAS initialized successfully for ${selectedRollup}`);
  } catch (error: unknown) {
    console.error('Error initializing EAS:', error);
    setAttestationStatus(
      error instanceof Error
        ? `Failed to initialize EAS: ${error.message}`
        : 'Failed to initialize attestation service. Please try again.'
    );
    setEAS(null);
  }
};

useEffect(() => {
  if (walletClient) {
    void initializeEAS(walletClient, setEAS, setAttestationStatus, selectedRollup);
  }
}, [walletClient, selectedRollup]);

  const handleAttestation = async (): Promise<void> => {
    if (!address || !walletClient || !publicClient || !eas) {
      setAttestationStatus("Error: Wallet not connected or EAS not initialized");
      return;
    }

    setIsAttesting(true);
    setAttestationStatus("Initiating attestation...");

    try {
      const schemaEncoder = new SchemaEncoder("address userAddress,uint256 tokenId,uint256 timestamp,address attester");
      const poapData = poaps[0]; // Assuming we're using the first POAP for simplicity

      if (!poapData) {
        throw new Error("No POAP data available");
      }

      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "tokenId", value: BigInt(poapData.token_id || 0), type: "uint256" },
        { name: "timestamp", value: BigInt(Math.floor(Date.now() / 1000)), type: "uint256" },
        { name: "attester", value: ATTESTER_ADDRESS, type: "address" },
      ]);

      const attestation = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      setAttestationStatus(`Attestation initiated. Waiting for confirmation...`);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: attestation.tx.hash as `0x${string}`
      });

      if (!receipt.transactionHash) {
        throw new Error("Failed to get valid transaction hash");
      }

      setAttestationStatus(`Attestation created successfully on ${selectedRollup}. Transaction Hash: ${receipt.transactionHash}`);
      onAttestationComplete();
    } catch (error: unknown) {
      console.error("Attestation error:", error);
      setAttestationStatus(`Attestation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsAttesting(false);
    }
  };

  const handleRollupChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRollup(e.target.value as "base" | "optimism");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Onchain Attestation</h2>
      <p className="mb-6 text-center text-gray-600">
        Receive an onchain attestation for completing the mission using the Ethereum Attestation Service (EAS) protocol:
      </p>
      <div className="mb-6">
        <label htmlFor="rollup" className="block mb-2 font-semibold">
          Select Rollup for Attestation:
        </label>
        <select
          id="rollup"
          value={selectedRollup}
          onChange={handleRollupChange}
          className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="base">Base (Ethereum L2 Rollup)</option>
          <option value="optimism">Optimism (Ethereum L2 Rollup)</option>
        </select>
        <p className="mt-2 text-sm text-gray-700">
          Your attestation will be created on the selected rollup, leveraging its scalability and lower transaction
          costs.
        </p>
      </div>
      {poaps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">POAP Data for Attestation:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {poaps.map(poap => (
              <li key={poap.token_id} className="text-gray-700">
                {poap.event.name} - {new Date(poap.event.start_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            This POAP data will be included in your onchain attestation as proof of your event attendance.
          </p>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Attestation Details:</h3>
        <p className="mb-2">
          <span className="font-semibold">Attester&apos;s onchain name:</span> {ATTESTER_NAME}
        </p>
        <p className="text-sm text-gray-600">
          The attestation will be created by {ATTESTER_NAME} using the Ethereum Attestation Service protocol on the
          selected rollup.
        </p>
      </div>
      <button
        onClick={handleAttestation}
        disabled={isAttesting || !address || !selectedRollup || poaps.length === 0}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 mb-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isAttesting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating Attestation...
          </span>
        ) : (
          `Create EAS Attestation on ${selectedRollup}`
        )}
      </button>
      {!address && <p className="mt-2 text-sm text-red-500">Please connect your wallet to create an attestation.</p>}
      {address && !selectedRollup && (
        <p className="mt-2 text-sm text-red-500">Please select a rollup for the attestation.</p>
      )}
      {address && selectedRollup && poaps.length === 0 && (
        <p className="mt-2 text-sm text-red-500">No valid POAPs found. Please verify your event attendance.</p>
      )}
      {attestationStatus && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {attestationStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default OnchainAttestation;
