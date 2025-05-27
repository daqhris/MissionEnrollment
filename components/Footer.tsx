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
  mb-16
  sm:mb-11
  lg:mb-0
`;

const FixedBottomBar = tw.div`
  fixed
  flex
  justify-between
  items-start
  sm:items-center
  w-full
  z-10
  p-2
  sm:p-4
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

export const Footer = (): JSX.Element => {
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
          <div className="pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-[#957777]">Made by</span>
              <Link
                href="https://www.base.org/name/daqhris"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:text-blue-500 text-xs sm:text-sm"
              >
                daqhris
              </Link>
              <span className="text-xs sm:text-sm text-[#957777]">&</span>
              <Link
                href="https://devin.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:text-blue-500 text-xs sm:text-sm"
              >
                devin
              </Link>
              <span className="hidden sm:inline text-[#957777]">|</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link
                href="https://devfolio.co/projects/mission-enrollment-b9f4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#957777] hover:text-[#a58a8a] text-xs"
              >
                Base Batch Europe
              </Link>
              <span className="inline-block text-[#957777]">
                <ExternalLinkIcon />
              </span>
              <Link
                href="https://ethglobal.com/showcase/missionenrollment-i4fkr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#957777] hover:text-[#a58a8a] text-xs"
              >
                ETHGlobal '24
              </Link>
              <span className="inline-block text-[#957777]">
                <ExternalLinkIcon />
              </span>
              <Link
                href="https://github.com/daqhris/MissionEnrollment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#957777] hover:text-[#a58a8a] text-xs"
              >
                GitHub
              </Link>
              <span className="inline-block text-[#957777]">
                <ExternalLinkIcon />
              </span>
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
