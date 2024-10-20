import { ReactNode } from 'react';
import {
  CheckLoginSessionProvider,
  LoginSessionRQProvider,
} from '@/components/context';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <LoginSessionRQProvider>
      <CheckLoginSessionProvider>{children}</CheckLoginSessionProvider>
    </LoginSessionRQProvider>
  );
}
