import { ReactNode } from 'react';

import AuthHeader from '@/app/(auth)/_components/AuthHeader';

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <AuthHeader />
      {children}
    </div>
  );
}
