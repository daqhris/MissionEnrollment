"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "../hooks/scaffold-eth";
import { useChainId } from 'wagmi';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  passHref?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, passHref }) => (
  <div className={`${isActive ? "bg-blue-600 shadow-md" : ""}`}>
    <Link href={href} passHref={passHref} className={`
      hover:bg-blue-500
      hover:shadow-md
      focus:!bg-blue-600
      active:!text-white
      py-1.5
      px-3
      text-sm
      rounded-full
      gap-2
      grid
      grid-flow-col
    `}>
      {children}
    </Link>
  </div>
);

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const NavBar = ({ children }: { children: React.ReactNode }) => (
  <div className="sticky lg:static top-0 navbar bg-gradient-to-r from-blue-900 to-blue-800 min-h-0 flex-shrink-0 justify-between z-20 shadow-md px-0 sm:px-2">
    {children}
  </div>
);

const NavbarStart = ({ children }: { children: React.ReactNode }) => (
  <div className="navbar-start w-auto lg:w-1/2">
    {children}
  </div>
);

const DropdownContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  (props, ref) => (
    <div ref={ref} className="lg:hidden dropdown">
      {props.children}
    </div>
  )
);

const BurgerMenuButton = ({ isOpen, onClick, children }: { isOpen: boolean, onClick: () => void, children: React.ReactNode }) => (
  <label
    tabIndex={0}
    className={`ml-1 btn text-white ${isOpen ? "hover:bg-blue-600" : "hover:bg-blue-700"}`}
    onClick={onClick}
  >
    {children}
  </label>
);

const DropdownMenu = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <ul
    tabIndex={0}
    className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-blue-900 text-white rounded-lg w-52"
    onClick={onClick}
  >
    {children}
  </ul>
);

const LogoContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex relative items-center justify-center w-12 h-12">
    {children}
  </div>
);

const LogoText = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col">
    {children}
  </div>
);

const LogoTitle = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold leading-tight text-[#957777]">
    {children}
  </span>
);

const DesktopMenu = ({ children }: { children: React.ReactNode }) => (
  <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
    {children}
  </ul>
);

const NavbarCenter = ({ children }: { children?: React.ReactNode }) => (
  <div className="navbar-center flex items-center justify-center">
    {children}
  </div>
);

const NavbarEnd = ({ children }: { children: React.ReactNode }) => (
  <div className="navbar-end flex-grow mr-4">
    {children}
  </div>
);

const ChainIdentifier = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-bold uppercase text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
    {children}
  </div>
);

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Enrollments",
    href: "/enrollments",
  },
  {
    label: "Preview",
    href: "/preview",
  },
  {
    label: "About",
    href: "/about",
  },
];

export const HeaderMenuLinks = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }): JSX.Element => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <NavLink href={href} isActive={isActive} passHref>
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        );
      })}
    </>
  );
};

export const Header = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const chainId = useChainId();
  useOutsideClick(
    burgerMenuRef,
    useCallback((): void => setIsDrawerOpen(false), []),
  );

  const getChainName = (id: number): string => {
    switch (id) {
      case 8453:
        return 'BASE';
      case 84532:
        return 'BASE SEPOLIA';
      default:
        return 'BASE';
    }
  };

  return (
    <NavBar>
      <NavbarStart>
        <DropdownContainer ref={burgerMenuRef}>
          <BurgerMenuButton
            isOpen={isDrawerOpen}
            onClick={(): void => {
              setIsDrawerOpen((prevIsOpenState: boolean): boolean => !prevIsOpenState);
            }}
          >
            <>
              <Bars3Icon className="h-1/2" />
              <span className="ml-2" role="img" aria-label="First place medal">🥇</span>
            </>
          </BurgerMenuButton>
          {isDrawerOpen && (
            <DropdownMenu
              onClick={(): void => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </DropdownMenu>
          )}
        </DropdownContainer>
        {/* DESIGN OPTION 1: Separate domain with smaller font and external link icon */}
        <div className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <LogoContainer>
              <span className="text-2xl" role="img" aria-label="First place medal">🥇</span>
            </LogoContainer>
            <LogoText>
              <LogoTitle>
                <span className="font-bold">mission-enrollment</span>
                <span className="text-gray-400 text-xs ml-1">.base.eth</span>
              </LogoTitle>
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 bg-[#957777] text-white rounded-full ml-2 animate-pulse">Beta</span>
              </div>
            </LogoText>
          </Link>
          <a 
            href="https://www.base.org/name/mission-enrollment" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
            title="View on Base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* DESIGN OPTION 2: Domain part as a badge with Base logo */}
        {/* <div className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <LogoContainer>
              <span className="text-2xl" role="img" aria-label="First place medal">🥇</span>
            </LogoContainer>
            <LogoText>
              <div className="flex items-center">
                <LogoTitle>
                  <span className="font-bold">mission-enrollment</span>
                </LogoTitle>
                <a 
                  href="https://www.base.org/name/mission-enrollment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 px-2 py-0.5 bg-blue-900 text-blue-300 rounded-full text-xs flex items-center hover:bg-blue-800 transition-colors"
                  title="View on Base"
                >
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  .base.eth
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 bg-[#957777] text-white rounded-full animate-pulse">Beta</span>
              </div>
            </LogoText>
          </Link>
        </div> */}

        {/* DESIGN OPTION 3: Split links with tooltip */}
        {/* <div className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <LogoContainer>
              <span className="text-2xl" role="img" aria-label="First place medal">🥇</span>
            </LogoContainer>
            <LogoText>
              <div className="flex items-center">
                <LogoTitle>mission-enrollment</LogoTitle>
              </div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 bg-[#957777] text-white rounded-full mr-2 animate-pulse">Beta</span>
                <a 
                  href="https://www.base.org/name/mission-enrollment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300 hover:underline group relative"
                >
                  .base.eth
                  <span className="absolute left-0 -bottom-6 w-32 bg-blue-900 text-xs text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    View on Base
                  </span>
                </a>
              </div>
            </LogoText>
          </Link>
        </div> */}
        <DesktopMenu>
          <HeaderMenuLinks />
        </DesktopMenu>
      </NavbarStart>
      <NavbarCenter />
      <NavbarEnd>
        <ChainIdentifier>{getChainName(chainId)}</ChainIdentifier>
      </NavbarEnd>
    </NavBar>
  );
};
