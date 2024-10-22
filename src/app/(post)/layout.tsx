import { ReactNode } from 'react';
import { CheckLoginSessionProvider } from '@/components/context';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CheckLoginSessionProvider>{children}</CheckLoginSessionProvider>;
}
