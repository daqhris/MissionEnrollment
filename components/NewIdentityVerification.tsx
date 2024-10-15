import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

interface IdentityVerificationProps {
  onVerified: (address: string, name: string) => void;
}

const NewIdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [retrievedName, setRetrievedName] = useState<string>("");

  useEffect(() => {
    detectNetwork();
  }, []);

  const detectNetwork = async () => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      try {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const network = await provider.getNetwork();
        if (network.name === "optimism" || network.name === "optimism-goerli") {
          setNetwork("optimism");
        } else if (network.name === "base" || network.name === "base-goerli") {
          setNetwork("base");
        } else {
          setNetwork(network.name);
        }
      } catch (error: any) {
        console.error("Error detecting network:", error);
        setError("Failed to detect network");
      }
    } else {
      setError("No Ethereum provider detected");
    }
  };

  const retrieveName = async (address: string): Promise<string> => {
    if (network === "base" || network === "base-goerli") {
      return `Basename-${address.slice(0, 6)}...${address.slice(-4)}`;
    } else {
      try {
        const mainnetProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
        const name = await mainnetProvider.lookupAddress(address);
        return name || address;
      } catch (error: any) {
        console.error("Error retrieving ENS name:", error);
        return address;
      }
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError("");

    try {
      let verifiedAddress = inputValue.trim();

      if (verifiedAddress.includes('.')) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const resolvedAddress = await provider.resolveName(verifiedAddress);
        if (!resolvedAddress) {
          throw new Error("Unable to resolve ENS name");
        }
        verifiedAddress = resolvedAddress;
      } else if (!ethers.utils.isAddress(verifiedAddress)) {
        verifiedAddress = ethers.utils.id(verifiedAddress); // Create a hash of the username
      }

      const name = await retrieveName(verifiedAddress);
      setRetrievedName(name);

      onVerified(verifiedAddress.toLowerCase(), name);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
      <p className="mb-4">Please enter your Ethereum address, ENS name, or username:</p>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full max-w-md p-2 border rounded mb-4"
          placeholder="0x..., name.eth, or username"
          disabled={isVerifying}
        />
        <button
          onClick={handleVerify}
          disabled={isVerifying || !inputValue.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {retrievedName && <p className="mt-2">Associated name: {retrievedName}</p>}
      {network && <p className="mt-2">Connected network: {network}</p>}
    </div>
  );
};

export default NewIdentityVerification;
