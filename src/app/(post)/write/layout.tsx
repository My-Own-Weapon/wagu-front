'use client';

import { ReactNode } from 'react';

import { WritePageHeader } from '@/app/(post)/write/_components';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <WritePageHeader />
      {children}
    </>
  );
}
