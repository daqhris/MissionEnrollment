import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('changelog');

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
