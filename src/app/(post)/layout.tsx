'use client';

import { ReactNode } from 'react';

import { useCheckSession } from '@/hooks/useCheckSession';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  useCheckSession();

  return <div>{children}</div>;
}
