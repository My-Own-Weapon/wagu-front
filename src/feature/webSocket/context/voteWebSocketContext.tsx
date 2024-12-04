'use client';

import { WebSocketStatus } from '@/feature/_types/webSocket';
import { useWebSocket } from '@/feature/webSocket/applications/hooks';
import {
  ServerProtocolMessageType,
  ConnectedUser,
} from '@/feature/webSocket/applications/hooks/useWebSocket';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from 'react';

interface VoteWebSocketContextValue {
  ws?: WebSocket;
  status: WebSocketStatus;
  sendMessage?: (
    payloadType: string,
    payload: unknown,
    initialType?:
      | ServerProtocolMessageType.INIT
      | ServerProtocolMessageType.CHAT,
  ) => boolean;
  reconnect: () => void;
  disconnect: () => void;
  connectedUsers: ConnectedUser[];
  setConnectedUsers: Dispatch<SetStateAction<ConnectedUser[]>>;
}

const voteWebSocketContext = createContext<VoteWebSocketContextValue | null>(
  null,
);

export const useVoteWebSocketContext = () => {
  const context = useContext(voteWebSocketContext);
  if (!context) {
    throw new Error(
      'useVoteWebSocketContext must be used within VoteWebSocketProvider',
    );
  }

  return context;
};

export function VoteWebSocketProvider({
  children,
  sessionId,
}: {
  children: React.ReactNode;
  sessionId: string;
}) {
  const {
    ws,
    status,
    sendMessage,
    reconnect,
    disconnect,
    connectedUsers,
    setConnectedUsers,
  } = useWebSocket({
    sessionId,
  });

  const value = useMemo(
    () => ({
      ws,
      status,
      sendMessage,
      reconnect,
      disconnect,
      connectedUsers,
      setConnectedUsers,
    }),
    [
      ws,
      status,
      sendMessage,
      reconnect,
      disconnect,
      connectedUsers,
      setConnectedUsers,
    ],
  );

  return (
    <voteWebSocketContext.Provider value={value}>
      {children}
    </voteWebSocketContext.Provider>
  );
}
