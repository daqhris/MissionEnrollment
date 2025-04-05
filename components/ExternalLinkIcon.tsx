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
        d="M10.5 3.75L14.25 7.5H9v1.5h5.25L10.5 12.75l1.06 1.06L18 7.5l-6.44-6.31L10.5 3.75z M18 13.5V18H6V6h4.5V4.5H6a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-4.5H18z"
      />
    </svg>
  );
};
