import { MainHeader } from '@/components/domain';
import { ReactNode } from 'react';

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
