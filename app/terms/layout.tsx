import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('terms');

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
