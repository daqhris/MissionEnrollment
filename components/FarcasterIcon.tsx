import React from "react";

interface FarcasterIconProps {
  className?: string;
}

export const FarcasterIcon: React.FC<FarcasterIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`inline-block ml-1 ${className}`}
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="#6E3AEA"
      />
      <text
        x="12"
        y="17"
        fontSize="16"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        F
      </text>
    </svg>
  );
};
