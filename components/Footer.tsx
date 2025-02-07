"use client";

import React from "react";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { hardhat } from "viem/chains";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "./scaffold-eth";
import { useTargetNetwork } from "../hooks/scaffold-eth/useTargetNetwork";
import { ExternalLinkIcon } from "./ExternalLinkIcon";

const FooterContainer = tw.div`
  min-h-0
  py-5
  px-1
  mb-11
  lg:mb-0
`;

const FixedBottomBar = tw.div`
  fixed
  flex
  justify-between
  items-center
  w-full
  z-10
  p-4
  bottom-0
  left-0
  pointer-events-none
`;

const LeftSection = tw.div`
  flex
  flex-col
  md:flex-row
  gap-2
  pointer-events-auto
`;

const StyledAnchor = tw.a`
  btn
  btn-primary
  btn-sm
  font-normal
  gap-1
`;

const FooterContent = tw.div`
  w-full
`;

const FooterMenu = tw.ul`
  menu
  menu-horizontal
  w-full
`;

const FooterLinks = tw.div`
  flex
  justify-center
  items-center
  gap-2
  text-xs
  w-full
`;

export const Footer = (): React.ReactElement => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <FooterContainer>
      <div>
        <FixedBottomBar>
          <LeftSection>
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref>
                  <StyledAnchor>
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    <span>Block Explorer</span>
                  </StyledAnchor>
                </Link>
              </>
            )}
          </LeftSection>
          <div className="pointer-events-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-base-content">Made by</span>
              <Link
                href={process.env.NEXT_PUBLIC_BASE_NAME_URL || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent-focus"
              >
                daqhris
              </Link>
              <span className="text-base-content">&</span>
              <Link
                href="https://devin.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent-focus"
              >
                devin
              </Link>
              <span className="text-base-content">|</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`${process.env.NEXT_PUBLIC_EAS_EXPLORER_URL}/attestations/forSchema/${process.env.NEXT_PUBLIC_SCHEMA_UID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-content hover:text-accent text-xs flex items-center"
              >
                Attest In-Test
                <ExternalLinkIcon />
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_SHOWCASE_URL || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-content hover:text-accent text-xs flex items-center"
              >
                ETHGlobal '24
                <ExternalLinkIcon />
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-content hover:text-accent text-xs flex items-center"
              >
                GitHub
                <ExternalLinkIcon />
              </Link>
            </div>
          </div>
        </FixedBottomBar>
      </div>
      <FooterContent>
        <FooterMenu>
          <FooterLinks>
          </FooterLinks>
        </FooterMenu>
      </FooterContent>
    </FooterContainer>
  );
};
