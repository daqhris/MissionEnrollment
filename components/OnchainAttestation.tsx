import React, { useState, useEffect } from "react";
import type { WalletClient, Account } from "viem";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useWalletClient, usePublicClient, useConnect } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { base, optimism } from 'viem/chains';

type TransactionSigner = {
  signTypedData: WalletClient['signTypedData'];
  getAddress: () => Promise<`0x${string}`>;
  signMessage: (message: string | Uint8Array) => Promise<`0x${string}`>;
};

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

const EAS_CONTRACT_ADDRESS: Record<string, `0x${string}`> = {
  base: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
  optimism: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"
};
const SCHEMA_UID: `0x${string}` = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd"; // Actual schema UID for mission enrollment
const ATTESTER_ADDRESS: `0x${string}` = "0xF0bC5CC2B4866dAAeCb069430c60b24520D77037"; // Actual address of daqhris.eth
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
  const { connect } = useConnect();

  useEffect(() => {
    if (!address || !walletClient || !publicClient) {
      setAttestationStatus('Please connect your wallet to continue.');
    } else {
      setAttestationStatus(null);
    }
  }, [address, walletClient, publicClient]);

  const connectCoinbaseWallet = async (): Promise<void> => {
    try {
      await connect({
        connector: new CoinbaseWalletConnector({
          chains: [base, optimism],
          options: {
            appName: 'Mission Enrollment',
          },
        }),
      });
    } catch (error) {
      console.error('Error connecting to Coinbase Wallet:', error);
      setAttestationStatus('Failed to connect Coinbase Wallet. Please try again.');
    }
  };

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
      const easAddress = EAS_CONTRACT_ADDRESS[selectedRollup];
      if (!easAddress) {
        throw new Error(`No EAS contract address found for ${selectedRollup}`);
      }
      const easInstance = new EAS(easAddress);

      if (!('signTypedData' in walletClient)) {
        throw new Error("Wallet client does not support signing typed data");
      }

      const signer: TransactionSigner = {
        signTypedData: walletClient.signTypedData,
        getAddress: async () => walletClient.account?.address as `0x${string}` ?? '0x0000000000000000000000000000000000000000',
        signMessage: async (message: string | Uint8Array) => {
          const signature = await walletClient.signMessage({
            message: typeof message === 'string' ? message : new TextDecoder().decode(message),
            account: walletClient.account as Account
          });
          return signature;
        }
      };

      await easInstance.connect(signer as any); // Type assertion to any to bypass type check
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
      {!address && (
        <button
          onClick={connectCoinbaseWallet}
          className="w-full p-3 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connect Coinbase Wallet
        </button>
      )}
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
        </div>
      )}
      <div className="mb-6">
        <button
          onClick={handleAttestation}
          disabled={isAttesting || !address || poaps.length === 0}
          className={`w-full p-3 ${
            isAttesting || !address || poaps.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white rounded-lg transition-colors`}
        >
          {isAttesting ? 'Creating Attestation...' : 'Create Attestation'}
        </button>
      </div>
      {attestationStatus && (
        <p className="text-center text-sm font-semibold text-gray-700">{attestationStatus}</p>
      )}
    </div>
  );
};

export default OnchainAttestation;
