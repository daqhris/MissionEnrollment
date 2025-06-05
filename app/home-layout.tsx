import { getPageMetadata } from "../utils/seo/getPageMetadata";

export const metadata = getPageMetadata('home');

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
