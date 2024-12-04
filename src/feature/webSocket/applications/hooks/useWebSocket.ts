import { localStorageApi } from '@/services/localStorageApi';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

type WebSocketSessionId = string;

/**
 * ⛔️ 아래의 2가지는 메세지를 보낼때 type이 'join_room'으로 동일합니다.
 * 단, message를 수신할때의 아래 두개의 type으로 달라집니다.
 * @type {INIT} : 웹소켓 생성자가 join_room으로 메세지 전송했을떄
 * @type {INIT_RESPONSE_OF_PARTICIPANT} : 웹소켓 참여자가 join_room으로 메세지 전송했을떄
 * @example if (웹소켓 첫번째 생성자) sendMessage('join_room', ...args) -> recievedMessage.type === 'INIT'
 * @example if (웹소켓 두번째 참여자) sendMessage('join_room', ...args) -> recievedMessage.type === 'JOIN'
 *
 * 아래는 message를 보냈을때와 수신할때 같은 타입입니다.
 * @type {LEAVE} : 웹소켓 참여자가 leave_room으로 메세지 전송했을떄
 * @type {CHAT} : 웹소켓 참여자와 생성자가 chat으로 채팅 메세지 전송했을떄
 */
export enum ServerProtocolMessageType {
  INIT = 'join_room',
  INIT_RESPONSE_OF_PARTICIPANT = 'join',
  INIT_RESPONSE_OF_CREATOR = 'all_users',
  LEAVE = 'leave',
  CHAT = 'chat',
}

export enum ClientProtocolMessageType {
  USER_JOIN = 'user_join',
  USER_INFO = 'user_info',
}

type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

interface UseWebSocketProps {
  sessionId: WebSocketSessionId;
}

interface WebSocketMessage {
  type: ServerProtocolMessageType;
  roomURL: string;
  data: {
    type: string;
    senderUserName: string;
    payload: unknown;
  };
}

export interface ConnectedUser {
  userName: string;
  userProfileImageUrl: string;
  isNomiateDone: boolean;
  isVoteDone: boolean;
}

const useWebSocket = ({ sessionId }: UseWebSocketProps) => {
  const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const webSocketRef = useRef<WebSocket>();
  const sendMessageRef = useRef<ReturnType<typeof curriedSendMessage>>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`wss://api.wagubook.shop:8080/chat`);

      webSocketRef.current = ws;
      // setStatus('CONNECTING');

      ws.addEventListener('open', () => {
        console.log('WebSocket open');

        sendMessageRef.current = curriedSendMessage(sessionId, ws);
        // setStatus('OPEN');

        const sendMessage = sendMessageRef.current;
        const userInfo = {
          userName: localStorageApi.getUserName() ?? '',
          userProfileImageUrl: localStorageApi.getUserProfileImageUrl() ?? '',
          isNomiateDone: false,
          isVoteDone: false,
        };
        setConnectedUsers([userInfo]);

        sendMessage(
          'socket-init',
          {
            senderName: localStorageApi.getUserName(),
            senderFullName: localStorageApi.getUserFullName(),
          },
          ServerProtocolMessageType.INIT,
        );

        sendMessage(ClientProtocolMessageType.USER_JOIN, { userInfo });
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
        const { type, data } = message;
        const { type: payloadType, senderUserName, payload } = data;

        switch (type) {
          case ServerProtocolMessageType.INIT_RESPONSE_OF_CREATOR:
            console.log('received all_users');
            break;

          case ServerProtocolMessageType.INIT:
            console.log('received init');
            break;

          case ServerProtocolMessageType.INIT_RESPONSE_OF_PARTICIPANT:
            // alert(`${senderUserName}님이 참여하였습니다.`);
            console.log('received init_response');
            break;

          case ServerProtocolMessageType.CHAT: {
            console.log('In Chat', message);
            const myUserName = localStorageApi.getUserName();

            if (payloadType === ClientProtocolMessageType.USER_JOIN) {
              const { userInfo } = payload as { userInfo: ConnectedUser };
              // eslint-disable-next-line max-depth
              if (senderUserName !== myUserName) {
                // 새로운 사용자를 목록에 추가
                setConnectedUsers((prev) => {
                  const exists = prev.some(
                    (user) => user.userName === userInfo.userName,
                  );
                  if (!exists) {
                    return [...prev, userInfo];
                  }
                  return prev;
                });

                // 자신의 정보를 새로운 사용자에게 전송
                const sendMessage = sendMessageRef.current;
                sendMessage?.(
                  ClientProtocolMessageType.USER_INFO,
                  {
                    userInfo: {
                      userName: myUserName,
                      userProfileImageUrl:
                        localStorageApi.getUserProfileImageUrl(),
                      isNominateDone: false,
                      isVoteDone: false,
                    },
                  },
                  ServerProtocolMessageType.CHAT,
                );
              }
            } else if (payloadType === ClientProtocolMessageType.USER_INFO) {
              const { userInfo } = payload as { userInfo: ConnectedUser };

              // eslint-disable-next-line max-depth
              if (senderUserName !== myUserName) {
                // 기존 사용자의 정보를 목록에 추가
                setConnectedUsers((prev) => {
                  const exists = prev.some(
                    (user) => user.userName === userInfo.userName,
                  );
                  if (!exists) {
                    return [...prev, userInfo];
                  }
                  return prev;
                });
              }
            }

            break;
          }
          case ServerProtocolMessageType.LEAVE:
            {
              const { userName } = payload as { userName: string };
              setConnectedUsers((prev) => {
                return prev.filter((user) => user.userName !== userName);
              });
            }
            break;

          default:
            console.log('default', event.data);
            break;
        }
      });
    } catch (err) {
      console.error('WebSocket connection error');
      setStatus('CLOSED');
    }
  }, [sessionId]);

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
    };
  }, [connect, disconnect]);

  const value = useMemo(
    () => ({
      ws: webSocketRef.current,
      status,
      sendMessage: sendMessageRef.current,
      reconnect: connect,
      disconnect,
      connectedUsers,
      setConnectedUsers,
    }),
    [status, sendMessageRef, connect, disconnect, connectedUsers, webSocketRef],
  );

  return value;
};

const curriedSendMessage = (sessionId: string, webSocket: WebSocket) => {
  return (
    payloadType: string,
    payload: unknown,
    serverProtocolType:
      | ServerProtocolMessageType.CHAT
      | ServerProtocolMessageType.INIT = ServerProtocolMessageType.CHAT,
  ) => {
    if (webSocket.readyState === WebSocket.OPEN) {
      const userName = localStorageApi.getUserName();
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

export const parseMessage = (eventData: string): WebSocketMessage => {
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

export default useWebSocket;
