import React from "react";

interface ExternalLinkIconProps {
  className?: string;
}

export const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="12"
      height="12"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`inline-block ml-1 ${className}`}
    >
      <path
        fill="currentColor"
        opacity="0.8"
        d="M7 7h10v2h-6.5l7 7-1.5 1.5-7-7V17H7V7z"
      />
    </svg>
  );
};
