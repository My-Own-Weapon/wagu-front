import { ReactNode } from 'react';

import { CheckLoginSessionProvider } from '@/feature/auth/context';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CheckLoginSessionProvider>{children}</CheckLoginSessionProvider>;
}
