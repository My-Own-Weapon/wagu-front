'use client';

import { ReactNode } from 'react';

import { useCheckSession } from '@/hooks/useCheckSession';
import WritePageHeader from '@/app/(post)/write/_component/WritePageHeader';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  useCheckSession();

  return (
    <>
      <WritePageHeader />
      {children}
    </>
  );
}
