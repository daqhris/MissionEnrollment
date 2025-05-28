import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('charter');

export default function CharterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
