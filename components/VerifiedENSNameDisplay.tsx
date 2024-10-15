import React from "react";
import { useEnsName } from "wagmi";

interface VerifiedENSNameDisplayProps {
  address: string;
  theme: string;
}

const VerifiedENSNameDisplay: React.FC<VerifiedENSNameDisplayProps> = ({ address, theme }) => {
  const formattedAddress = address.startsWith('0x') ? address as `0x${string}` : `0x${address}`;
  const { data: ensName, isLoading, isError } = useEnsName({ address: formattedAddress });

  if (isLoading) {
    return <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Loading ENS name...</p>;
  }

  if (isError) {
    return <p className={`${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Error fetching ENS name</p>;
  }

  return (
    <div className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      {ensName ? <p>ENS Name: {ensName}</p> : <p>No ENS name found for this address</p>}
    </div>
  );
};

export default VerifiedENSNameDisplay;
