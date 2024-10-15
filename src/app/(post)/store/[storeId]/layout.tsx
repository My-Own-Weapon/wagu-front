import { ReactNode } from 'react';

import MainHeader from '@/components/Header';

export default function StoreLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
