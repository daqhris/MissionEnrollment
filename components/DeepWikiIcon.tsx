import React from "react";

interface DeepWikiIconProps {
  className?: string;
}

export const DeepWikiIcon: React.FC<DeepWikiIconProps> = ({ className = "" }) => {
  return (
    <img
      src="https://avatars.githubusercontent.com/in/811515?s=41&amp;u=22ae8177548c8cd6cccb497ac571937d080c80bc&amp;v=4"
      alt="Cognition Labs Logo"
      width="20"
      height="20"
      className={`inline-block ml-1 ${className}`}
    />
  );
};
