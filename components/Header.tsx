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
    label: "Charter",
    href: "/charter",
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
        {/* Final design: Split links with tooltip and right-aligned .base.eth */}
        <div className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <LogoContainer>
                <span className="text-2xl" role="img" aria-label="First place medal">🥇</span>
              </LogoContainer>
              <LogoText>
                <div className="flex items-center">
                  <LogoTitle>mission-enrollment</LogoTitle>
                </div>
                <div className="flex items-center justify-between w-full">
                  <a 
                    href="https://www.base.org/name/mission-enrollment" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:underline group relative"
                    onClick={(e) => {
                      e.preventDefault();
                      const url = "https://www.base.org/name/mission-enrollment";
                      const newTab = window.open(url, "_blank");
                      if (newTab) newTab.opener = null;
                    }}
                  >
                    .base.eth
                    <span className="absolute left-0 -bottom-6 w-32 bg-blue-900 text-xs text-white p-1 rounded hidden group-hover:block transition-opacity">
                      View on Base
                    </span>
                  </a>
                </div>
              </LogoText>
            </Link>
          </div>
        </div>
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
