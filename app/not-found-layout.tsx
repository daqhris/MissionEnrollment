```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found - Mission Enrollment',
  description: 'The requested page could not be found.',
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```
