"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import tw from "tailwind-styled-components";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useChainId } from 'wagmi';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  passHref?: boolean;
}

const StyledNavContainer = tw.div`
  ${({ isActive }: { isActive?: boolean }) => isActive ? "bg-blue-600 shadow-md" : ""}
`;

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, passHref }) => (
  <StyledNavContainer isActive={isActive}>
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
  </StyledNavContainer>
);

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const NavBar = tw.div`
  sticky
  lg:static
  top-0
  navbar
  bg-gradient-to-r
  from-blue-900
  to-blue-800
  min-h-0
  flex-shrink-0
  justify-between
  z-20
  shadow-md
  px-0
  sm:px-2
`;

const NavbarStart = tw.div`
  navbar-start
  w-auto
  lg:w-1/2
`;

const DropdownContainer = tw.div`
  lg:hidden
  dropdown
`;

const BurgerMenuButton = tw.label<{ $isOpen: boolean }>`
  ml-1
  btn
  text-white
  ${(p: { $isOpen: boolean }): string => (p.$isOpen ? "hover:bg-blue-600" : "hover:bg-blue-700")}
`;

const DropdownMenu = tw.ul`
  menu
  menu-compact
  dropdown-content
  mt-3
  p-2
  shadow-lg
  bg-blue-900
  text-white
  rounded-lg
  w-52
`;

const LogoContainer = tw.div`
  flex
  relative
  w-24
  h-12
  overflow-hidden
`;

const LogoText = tw.div`
  flex
  flex-col
`;

const LogoTitle = tw.span`
  font-bold
  leading-tight
`;

const DesktopMenu = tw.ul`
  hidden
  lg:flex
  lg:flex-nowrap
  menu
  menu-horizontal
  px-1
  gap-2
`;

const NavbarCenter = tw.div`
  navbar-center
  flex
  items-center
  justify-center
`;

const NavbarEnd = tw.div`
  navbar-end
  flex-grow
  mr-4
`;

const ChainIdentifier = tw.div`
  text-sm
  font-bold
  uppercase
  text-white
  bg-blue-500
  hover:bg-blue-600
  px-4
  py-2
  rounded-lg
`;

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Recent",
    href: "/recent",
  },
  {
    label: "Attestations",
    href: "/attestations",
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
            tabIndex={0}
            $isOpen={isDrawerOpen}
            onClick={(): void => {
              setIsDrawerOpen((prevIsOpenState: boolean): boolean => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </BurgerMenuButton>
          {isDrawerOpen && (
            <DropdownMenu
              tabIndex={0}
              onClick={(): void => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </DropdownMenu>
          )}
        </DropdownContainer>
        <Link href="/" className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <LogoContainer>
            <Image alt="Mission Enrollment logo" className="cursor-pointer object-contain" fill src="/logo.png" />
          </LogoContainer>
          <LogoText>
            <LogoTitle>Mission Enrollment</LogoTitle>
            {/*<span className="text-xs">Ethereum dev stack</span>*/}
          </LogoText>
        </Link>
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
