import { ReactNode } from 'react';

import { MainHeader } from '@/components/domain';

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
