import { MainHeader } from '@/components/feature';
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
