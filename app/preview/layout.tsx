import { type ReactNode } from 'react';

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
