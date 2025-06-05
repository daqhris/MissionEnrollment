import { type ReactNode } from 'react';
import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('preview');

export default function PreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
