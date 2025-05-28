import { getPageMetadata } from "../../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('about');

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
