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
        d="M7 7h8v2H9v6H7V7zm6 0v2h2.59l-9.13 9.13 1.41 1.41L17 10.41V13h2V7h-6z"
      />
    </svg>
  );
};
