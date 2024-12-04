/* eslint-disable @typescript-eslint/no-explicit-any */
export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export enum WebSocketEventTypes {
  VOTE_UPDATE = 'voteUpdate',
  VOTE_START = 'voteStart',
  VOTE_DONE = 'voteDone',
  USER_DATA = 'userData',
  USER_LOCATION = 'userLocation',
}

export enum WEBSOCKET_SIGNAL_TYPES {
  SERVER_PROTOCOL_KEY = 'type',
  SERVER_PROTOCOL_WEB_SOCKET_START_VALUE = 'join_room',
  SERVER_PROTOCOL_CHAT_VALUE = 'chat',
  PING = 'ping',
  PONG = 'pong',
}

export interface WebSocketMessage {
  type: string;
  data: {
    senderUserName: string;
    type: string;
    payload: Record<string, any>;
  };
}

export interface WebSocketConfig {
  url: string;
  sessionId: string;
  retry?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  handlers: Record<WebSocketEventTypes, (...args: any[]) => void>;
}
