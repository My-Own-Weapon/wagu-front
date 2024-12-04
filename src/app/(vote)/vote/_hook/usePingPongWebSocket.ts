/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { localStorageApi } from '@/services/localStorageApi';
import { useEffect, useRef, useState, useCallback } from 'react';

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export interface MessageHandlers {
  [key: string]: (data: any) => void;
}

interface WebSocketMessage {
  type: string;
  data: {
    senderUserName: string;
    type: string;
    payload: {
      [key: string]: any;
    };
  };
}

enum WEBSOCKET_SIGNAL_TYPES {
  /* Server Rules */
  SERVER_PROTOCOL_KEY = 'type',
  SERVER_PROTOCOL_WEB_SOCKET_START_VALUE = 'join_room',
  SERVER_PROTOCOL_CHAT_VALUE = 'chat',

  /* Client Rules */
  PING = 'ping',
  PONG = 'pong',
}

export enum WebSocketEventTypes {
  VOTE_UPDATE = 'voteUpdate',
  VOTE_START = 'voteStart',
  VOTE_DONE = 'voteDone',
  USER_DATA = 'userData',
  USER_LOCATION = 'userLocation',
}

export interface WebSocketMessageHandlers {
  [WebSocketEventTypes.VOTE_UPDATE]: (sessionId: string) => Promise<void>;
  [WebSocketEventTypes.VOTE_START]: () => void;
  [WebSocketEventTypes.VOTE_DONE]: (userName: string) => void;
  [WebSocketEventTypes.USER_DATA]: (userDetail: any) => void;
  [WebSocketEventTypes.USER_LOCATION]: (location: any) => void;
}

interface Props {
  sessionId: string;
  retry?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  handlers?: WebSocketMessageHandlers;
}

export const useWebSocket = ({
  sessionId,
  retry = true,
  retryInterval = 1000 * 60 * 30,
  maxRetries = 3,
  handlers,
}: Props) => {
  const myUserName = localStorageApi.getUserName();
  const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
  const [error, setError] = useState<Error | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const retryTimeoutId = useRef<NodeJS.Timeout>();
  const pingIntervalId = useRef<NodeJS.Timeout>();
  const pongTimeoutId = useRef<NodeJS.Timeout>();
  const lastPongTime = useRef<number>(Date.now());

  const sendPing = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      sendMessage(WEBSOCKET_SIGNAL_TYPES.PING, {
        senderUserName: myUserName,
      });
      /**
       * @TODO ✅ interval id가 지속적으로 같음
       *       react의 생명주기와 setInterval이 참조하는 id가 다름
       */
      console.log('interval Id : ', pingIntervalId.current);

      // pong 응답 대기
      pongTimeoutId.current = setTimeout(() => {
        console.log('Pong 응답 없음 - 재연결 시도');
        socket.current?.close();
      }, 5000);
    }
  }, []);

  const startPingInterval = useCallback(() => {
    if (pingIntervalId.current) {
      clearInterval(pingIntervalId.current);
    }
    pingIntervalId.current = setInterval(sendPing, 10000);
  }, []);

  const stopPingInterval = useCallback(() => {
    if (pingIntervalId.current) {
      clearInterval(pingIntervalId.current);
    }
    if (pongTimeoutId.current) {
      clearTimeout(pongTimeoutId.current);
    }
  }, []);

  const connect = useCallback(() => {
    try {
      const webSocket = new WebSocket(`wss://api.wagubook.shop:8080/chat`);
      socket.current = webSocket;
      setStatus('CONNECTING');

      webSocket.addEventListener('open', () => {
        console.log('@ 웹소켓 연결 성공');
        setStatus('OPEN');
        setError(null);
        retryCount.current = 0;

        webSocket.send(
          JSON.stringify({
            [WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_KEY]:
              WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_WEB_SOCKET_START_VALUE,
            roomURL: sessionId,
            data: JSON.stringify({
              // init room message
              type: 'initial_data',
              payload: {
                senderName: localStorageApi.getUserName(),
                senderFullName: localStorageApi.getUserFullName(),
              },
            }),
          }),
        );

        startPingInterval();
      });

      webSocket.addEventListener('close', () => {
        console.log('@ 웹소켓 연결 종료');
        setStatus('CLOSED');
        stopPingInterval();

        if (retry && retryCount.current < maxRetries) {
          retryCount.current += 1;
          retryTimeoutId.current = setTimeout(() => {
            connect();
          }, retryInterval);
        }
      });

      webSocket.addEventListener('message', (event: MessageEvent) => {
        if (!handlers) return;
        const copiedEventData = event.data;
        console.log(JSON.parse(copiedEventData));

        const message: WebSocketMessage = parseMessage(copiedEventData);
        const { type, data } = message;
        const { type: payloadType, senderUserName } = data;

        /* ignore my message */
        if (type === 'chat' && senderUserName === myUserName) {
          return;
        }

        if (
          payloadType === WEBSOCKET_SIGNAL_TYPES.PING &&
          senderUserName !== myUserName
        ) {
          sendMessage(WEBSOCKET_SIGNAL_TYPES.PONG, {
            senderUserName: myUserName,
          });
          return;
        }

        if (
          payloadType === WEBSOCKET_SIGNAL_TYPES.PONG &&
          senderUserName !== myUserName
        ) {
          if (pongTimeoutId.current) {
            clearTimeout(pongTimeoutId.current);
          }
          lastPongTime.current = Date.now();
          return;
        }

        switch (payloadType) {
          case WebSocketEventTypes.VOTE_UPDATE:
            handlers.voteUpdate(sessionId);
            break;

          case WebSocketEventTypes.VOTE_START:
            handlers.voteStart();
            break;

          case WebSocketEventTypes.VOTE_DONE:
            const { userName } = data.payload;

            handlers.voteDone(userName);
            break;

          case WebSocketEventTypes.USER_DATA:
            const userDetail = data.payload;

            handlers.userData(userDetail);
            break;

          case WebSocketEventTypes.USER_LOCATION:
            const location = data.payload;

            handlers.userLocation(location);
            break;

          default:
            console.error('Unknown message type:', payloadType);
        }
      });

      webSocket.addEventListener('error', () => {
        console.error('@ 웹소켓 에러');
        setError(new Error('WebSocket connection error'));
      });
    } catch (error) {
      setError(error as Error);
      setStatus('CLOSED');
      stopPingInterval();
      alert('WebSocket connection error');
    }
  }, [sessionId, retry, maxRetries, retryInterval, handlers]);

  const sendMessage = useCallback(
    (type: string, payload: unknown) => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const message = createMessage({
          sessionId,
          payloadType: type,
          payload,
        });

        socket.current.send(message);
        return true;
      }
      return false;
    },
    [sessionId],
  );

  const disconnect = useCallback(() => {
    if (retryTimeoutId.current) {
      clearTimeout(retryTimeoutId.current);
    }

    if (socket.current) {
      socket.current.close();
    }
  }, []);

  useEffect(() => {
    connect();

    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, [connect, disconnect]);

  return {
    status,
    error,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
};

const parseMessage = (eventData: string) => {
  const message = JSON.parse(eventData);
  if (!message.data) return message;

  if (typeof message.data === 'string' && message.data.includes('payload')) {
    const payloadObject = JSON.parse(message.data);
    return {
      ...message,
      data: payloadObject,
    };
  }

  return message;
};

interface CreateMessageProps {
  protocolType?:
    | WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_CHAT_VALUE
    | WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_WEB_SOCKET_START_VALUE;
  sessionId: string;
  payloadType: string;
  payload: any;
}
const createMessage = ({
  protocolType = WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_CHAT_VALUE,
  sessionId,
  payloadType,
  payload,
}: CreateMessageProps) => {
  const DEFAULT_PARAMS = {
    [WEBSOCKET_SIGNAL_TYPES.SERVER_PROTOCOL_KEY]: protocolType,
    roomURL: sessionId,
  };

  return JSON.stringify({
    ...DEFAULT_PARAMS,
    data: JSON.stringify({
      senderUserName: localStorageApi.getUserName(),
      type: payloadType,
      payload,
    }),
  });
};
