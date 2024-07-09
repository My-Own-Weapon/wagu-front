import BackHeader from '@/components/BackHeader';
import { ReactNode } from 'react';

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <BackHeader />
      {children}
    </div>
  );
}
