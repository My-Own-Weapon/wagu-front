// import LiveHeader from '@/app/live/_components/LiveHeader';
import { ReactNode } from 'react';

export default function LiveLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* <LiveHeader /> */}
      {children}
    </div>
  );
}
