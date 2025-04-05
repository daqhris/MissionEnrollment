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
        d="M10 6v2h5.59L6 17.59 7.41 19 17 9.41V15h2V6z"
      />
    </svg>
  );
};
