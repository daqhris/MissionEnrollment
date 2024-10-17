import React, { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useWalletClient, useChainId } from 'wagmi';
import { WalletClient, TypedDataDomain, SignableMessage } from 'viem';
import { TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { OnchainAttestationProps, CustomSigner, EAS_CONTRACT_ADDRESS } from '../types';

const OnchainAttestation: React.FC<OnchainAttestationProps> = ({ onAttestationComplete, poaps }) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const [eas, setEAS] = useState<EAS | null>(null);
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);
  const [selectedRollup, setSelectedRollup] = useState<"base" | "optimism">("base");

  const initializeEAS = async (
    walletClient: WalletClient | null,
    setEAS: React.Dispatch<React.SetStateAction<EAS | null>>,
    setAttestationStatus: React.Dispatch<React.SetStateAction<string | null>>,
    selectedRollup: "base" | "optimism"
  ): Promise<void> => {
    if (!walletClient) {
      setAttestationStatus("Wallet not connected");
      return;
    }

    try {
      const signer: CustomSigner = {
        getAddress: async () => walletClient.account?.address || "",
        signMessage: async (message: string | Uint8Array) => {
          if (!walletClient.account) throw new Error("No account connected");
          return walletClient.signMessage({ message: message as SignableMessage, account: walletClient.account });
        },
        sendTransaction: async (transaction: TransactionRequest) => {
          if (!walletClient.account) throw new Error("No account connected");
          const { to, data, value } = transaction;
          const hash = await walletClient.sendTransaction({
            to: to as `0x${string}`,
            data: data as `0x${string}` | undefined,
            value: value ? BigInt(value.toString()) : undefined,
            account: walletClient.account,
            chain: walletClient.chain,
          });
          return { hash };
        },
        _signTypedData: async (domain: TypedDataDomain, types: Record<string, Array<TypedDataDomain>>, value: Record<string, unknown>) => {
          if (!walletClient.account) throw new Error("No account connected");
          return walletClient.signTypedData({
            domain,
            types: types as Record<string, Array<{ name: string; type: string }>>,
            primaryType: Object.keys(types)[0] || 'EIP712Domain',
            message: value,
            account: walletClient.account,
          });
        },
      };

      const contractAddress = EAS_CONTRACT_ADDRESS[selectedRollup];
      if (!contractAddress) {
        throw new Error(`No contract address found for ${selectedRollup}`);
      }
      const eas = new EAS(contractAddress);
      eas.connect(signer);
      setEAS(eas);
      setAttestationStatus("EAS initialized");
    } catch (error) {
      console.error("Error initializing EAS:", error);
      setAttestationStatus("Error initializing EAS");
    }
  };

  const handleAttestation = async (): Promise<void> => {
    if (!eas || !address || poaps.length === 0) {
      setAttestationStatus("EAS not initialized, address not available, or no POAPs");
      return;
    }

    try {
      const schemaEncoder = new SchemaEncoder("uint256 eventId, string eventName, uint256 timestamp");
      const encodedData = schemaEncoder.encodeData([
        { name: "eventId", value: BigInt(poaps[0]?.token_id || "0"), type: "uint256" },
        { name: "eventName", value: poaps[0]?.event?.name || "", type: "string" },
        { name: "timestamp", value: BigInt(Date.parse(poaps[0]?.event?.start_date || "0")), type: "uint256" },
      ]);

      const schemaUID = "0x0000000000000000000000000000000000000000000000000000000000000000"; // Replace with actual schema UID

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      setAttestationStatus("Attestation successful");
      onAttestationComplete(newAttestationUID);
    } catch (error) {
      console.error("Error creating attestation:", error);
      setAttestationStatus("Error creating attestation");
    }
  };

  const handleRollupChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRollup(event.target.value as "base" | "optimism");
  };

  useEffect(() => {
    if (walletClient && chainId) {
      void initializeEAS(walletClient, setEAS, setAttestationStatus, selectedRollup);
    }
  }, [walletClient, chainId, selectedRollup]);

  return (
    <div>
      <h2>Onchain Attestation</h2>
      <select value={selectedRollup} onChange={handleRollupChange}>
        <option value="base">Base</option>
        <option value="optimism">Optimism</option>
      </select>
      <p>Status: {attestationStatus}</p>
      <button onClick={handleAttestation} disabled={!eas || !address}>
        Create Attestation
      </button>
    </div>
  );
};

export default OnchainAttestation;
