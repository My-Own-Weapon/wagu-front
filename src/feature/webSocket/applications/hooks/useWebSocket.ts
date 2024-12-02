import { localStorageApi } from '@/services/localStorageApi';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

type WebSocketSessionId = string;
enum ServerProtocolType {
  INIT = 'join_room',
  JOIN = 'join',
  CHAT = 'chat',
}
type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

interface UseWebSocketProps<THandlers> {
  sessionId: WebSocketSessionId;
  messageHandlers: THandlers;
}

interface WebSocketMessage {
  type: ServerProtocolType;
  roomURL: string;
  data: {
    type: string;
    senderUserName: string;
    senderFullName: string;
    payload: unknown;
  };
}

const useWebSocket = <
  THandlers extends Record<string, (...args: unknown[]) => unknown>,
>({
  sessionId,
}: UseWebSocketProps<THandlers>) => {
  const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
  const webSocketRef = useRef<WebSocket | null>(null);
  const sendMessageRef = useRef<ReturnType<typeof curriedSendMessage>>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`wss://api.wagubook.shop:8080/chat`);

      webSocketRef.current = ws;
      setStatus('CONNECTING');

      ws.addEventListener('open', () => {
        console.log('WebSocket open');

        sendMessageRef.current = curriedSendMessage<THandlers>(sessionId, ws);
        setStatus('OPEN');
        sendMessageRef.current(
          'socket-init',
          {
            senderName: localStorageApi.getUserName(),
            senderFullName: localStorageApi.getUserFullName(),
          },
          ServerProtocolType.INIT,
        );
      });

      ws.addEventListener('close', () => {
        console.log('WebSocket detected close');

        setStatus('CLOSED');
      });

      ws.addEventListener('error', () => {
        console.error('WebSocket detected error');

        setStatus('CLOSED');
      });

      ws.addEventListener('message', (event) => {
        const message = parseMessage(event.data);
        /**
         * @type join, chat, all_users
         *
         * all_users : 웹소켓 생성자가 join_room으로 메세지 전송했을떄
         * join : 웹소켓 참여자가 join_room으로 메세지 전송했을떄
         * chat : 웹소켓 참여자와 생성자가 chat으로 채팅 메세지 전송했을떄
         */
        const { type, data } = message;
        const { type: payloadType, senderUserName, senderFullName } = data;

        switch (type) {
          case ServerProtocolType.INIT:
            alert(data);
            break;

          case ServerProtocolType.JOIN:
            alert(`${senderUserName}(${senderFullName})님이 참여하였습니다.`);
            break;
        }
      });
    } catch (err) {
      console.error('WebSocket connection error');
      setStatus('CLOSED');
    }
  }, [sendMessageRef]);

  const disconnect = useCallback(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
  }, []);

  useEffect(() => {
    connect();

    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
      disconnect();
    };
  }, [connect, disconnect]);

  const value = useMemo(
    () => ({
      ws: webSocketRef.current,
      status,
      sendMessage: sendMessageRef.current,
      reconnect: connect,
      disconnect,
    }),
    [status, sendMessageRef, connect, disconnect],
  );

  return value;
};

const curriedSendMessage = <
  THandlers extends Record<string, (...args: unknown[]) => unknown>,
>(
  sessionId: string,
  webSocket: WebSocket,
) => {
  return (
    payloadType: keyof THandlers,
    payload: Parameters<THandlers[typeof payloadType]>[0],
    serverProtocolType: ServerProtocolType = ServerProtocolType.CHAT,
  ) => {
    if (webSocket.readyState === WebSocket.OPEN) {
      const userName = localStorage.getItem('userName') ?? 'anonymous';
      const payloadData = JSON.stringify({
        senderUserName: userName,
        type: payloadType,
        payload,
      });
      const message = {
        type: serverProtocolType,
        roomURL: sessionId,
        data: payloadData,
      };

      webSocket.send(JSON.stringify(message));

      return true;
    }
    return false;
  };
};

const parseMessage = (eventData: string): WebSocketMessage => {
  const message = JSON.parse(eventData);
  if (!message.data) return message as WebSocketMessage;

  if (typeof message.data === 'string' && message.data.includes('payload')) {
    const payloadObject = JSON.parse(message.data);
    return {
      ...message,
      data: payloadObject,
    };
  }

  return message;
};

class User {
  private userName: string;
  private userImageUrl: string;
  private isNomiateDone: boolean;
  private isVoteDone: boolean;

  constructor(
    userName: string,
    userImageUrl: string,
    isNomiateDone: boolean,
    isVoteDone: boolean,
  ) {
    this.userName = userName;
    this.userImageUrl = userImageUrl;
    this.isNomiateDone = isNomiateDone;
    this.isVoteDone = isVoteDone;
  }

  getUserName() {
    return this.userName;
  }

  getUserImageUrl() {
    return this.userImageUrl;
  }

  getIsNomiateDone() {
    return this.isNomiateDone;
  }

  setIsNomiateDone(isNomiateDone: boolean) {
    this.isNomiateDone = isNomiateDone;
  }

  getIsVoteDone() {
    return this.isVoteDone;
  }

  setIsVoteDone(isVoteDone: boolean) {
    this.isVoteDone = isVoteDone;
  }
}

export default useWebSocket;
