import { ReactNode } from 'react';

import { MainHeader } from '@/components/feature';

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
