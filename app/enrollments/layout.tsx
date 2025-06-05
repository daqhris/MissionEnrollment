import { getPageMetadata } from "../../utils/seo/getPageMetadata";
import { EnrollmentsClientLayout } from './EnrollmentsClientLayout';

export const metadata = getPageMetadata('enrollments');

export default function EnrollmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnrollmentsClientLayout>
      {children}
    </EnrollmentsClientLayout>
  );
}
