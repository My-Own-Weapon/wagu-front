'use client';

import { ReactNode } from 'react';

import { useCheckLoginSession } from '@/hooks/api';

export default function CheckLoginSessionProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { isLoading } = useCheckLoginSession();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return children;
}
