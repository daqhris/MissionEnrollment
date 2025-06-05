import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('privacy');

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
