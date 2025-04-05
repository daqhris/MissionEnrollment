import React from "react";

interface ExternalLinkIconProps {
  className?: string;
}

export const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="13.5"
      height="13.5"
      aria-hidden="true"
      viewBox="0 0 448 512"
      className={`inline-block ml-1 ${className}`}
    >
      <path
        fill="currentColor"
        d="M264 136l-16.9-17L440 16l-32-16H240v48h101.5L160 229.3 184.1 256 368 73.3V176h48V32c0-10.1-4.7-19.6-12.8-25.6S384.5 0 376 0H184c-13.3 0-24 10.7-24 24v48h48V48h88l-32 16L72 256l32 32L264 136z"
      />
    </svg>
  );
};
