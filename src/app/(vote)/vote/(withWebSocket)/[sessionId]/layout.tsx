import { SessionIdProvider } from '@/feature/webRTC/context';
import { VoteWebSocketProvider } from '@/feature/webSocket/context/voteWebSocketContext';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function VoteWithWebSocketLayout({
  children,
  params,
}: Props) {
  const sessionId = (await params).sessionId;

  return (
    <SessionIdProvider sessionId={sessionId}>
      <VoteWebSocketProvider sessionId={sessionId}>
        {children}
      </VoteWebSocketProvider>
    </SessionIdProvider>
  );
}
