import React from "react";

interface FarcasterIconProps {
  className?: string;
}

export const FarcasterIcon: React.FC<FarcasterIconProps> = ({ className = "" }) => {
  return (
    <img
      src="https://avatars.githubusercontent.com/u/98775309?s=200&v=4"
      alt="Farcaster Logo"
      width="20"
      height="20"
      className={`inline-block ml-1 ${className}`}
    />
  );
};
