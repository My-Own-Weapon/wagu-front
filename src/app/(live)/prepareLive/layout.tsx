import VotePhaseHeader from '@/app/(vote)/vote/(withWebSocket)/[sessionId]/votePhase/_components/VotePhaseHeader';

interface PrepareLiveLayoutProps {
  children: React.ReactNode;
}

export default function PrepareLiveLayout({
  children,
}: PrepareLiveLayoutProps) {
  return (
    <>
      <VotePhaseHeader />
      {children}
    </>
  );
}
