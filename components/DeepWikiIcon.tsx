import React from "react";

interface DeepWikiIconProps {
  className?: string;
}

export const DeepWikiIcon: React.FC<DeepWikiIconProps> = ({ className = "" }) => {
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
        fill="#2563EB"
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
        D
      </text>
    </svg>
  );
};
