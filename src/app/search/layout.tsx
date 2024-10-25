import { ReactNode } from 'react';

import { MainHeader } from '@/components/domain';

export default function SearchPage({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
