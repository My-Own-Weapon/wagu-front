import ResultHeader from '@/app/(vote)/vote/resultPhase/_components/ResultPhaseHeader';

export default function ResultPhaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ResultHeader />
      {children}
    </>
  );
}
