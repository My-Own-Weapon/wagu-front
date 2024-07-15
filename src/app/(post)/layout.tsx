'use client';

import BackHeader from '@/components/BackHeader';
import { useCheckSession } from '@/hooks/useCheckSession';
import { ReactNode } from 'react';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  useCheckSession();

  return (
    <>
      <BackHeader />
      {children}
    </>
  );
}
