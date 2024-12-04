'use client';

import { RTCSessionId } from '@/feature/_types';
import { createContext, useContext } from 'react';

const sessionIdContext = createContext<RTCSessionId>('');

export const useSessionIdContext = () => {
  const context = useContext(sessionIdContext);
  if (!context) {
    throw new Error(
      'useSessionIdContext must be used within a SessionIdProvider',
    );
  }

  return context;
};

export default function SessionIdProvider({
  children,
  sessionId,
}: {
  children: React.ReactNode;
  sessionId: RTCSessionId;
}) {
  return (
    <sessionIdContext.Provider value={sessionId}>
      {children}
    </sessionIdContext.Provider>
  );
}
