import { ReactNode } from 'react';
import VotePhaseHeader from '@/app/(vote)/vote/(withWebSocket)/[sessionId]/votePhase/_components/VotePhaseHeader';

interface VotePhaseLayoutProps {
  children: ReactNode;
}
function VotePhaseLayout({ children }: VotePhaseLayoutProps) {
  return (
    <>
      <VotePhaseHeader />
      {children}
    </>
  );
}

export default VotePhaseLayout;
