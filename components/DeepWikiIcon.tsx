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
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <text
        x="12"
        y="17"
        fontSize="16"
        fontWeight="bold"
        fill="#2563EB"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        D
      </text>
      <circle cx="6" cy="6" r="3" fill="#FF5757" />
      <circle cx="18" cy="6" r="3" fill="#47CAFF" />
      <circle cx="18" cy="18" r="3" fill="#8C52FF" />
      <circle cx="6" cy="18" r="3" fill="#FFD43D" />
    </svg>
  );
};
