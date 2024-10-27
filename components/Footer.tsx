import React from "react";
import tw from "tailwind-styled-components";

const FooterContainer = tw.div`
  min-h-0
  py-5
  px-1
  mb-11
  lg:mb-0
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
  text-sm
  w-full
`;

export const Footer = (): JSX.Element => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterMenu>
          <FooterLinks>
            {/* Footer content goes here */}
          </FooterLinks>
        </FooterMenu>
      </FooterContent>
    </FooterContainer>
  );
};
