'use client';

import { useGetRTCConnectionToken } from '@/feature/webRTC/applications/hooks';
import { localStorageApi } from '@/services/localStorageApi';
import { useSearchParams } from 'next/navigation';
import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface RTCSession {
  openVidu: OpenVidu;
  ovSession: Session;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
}
const WebRTCContext = createContext<RTCSession | null>(null);

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTCContext must be used within a WebRTCProvider');
  }
  return context;
};

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const { getConnectionToken } = useGetRTCConnectionToken();
  const firstRender = useRef<boolean>(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  if (!sessionId && firstRender.current) {
    throw new Error('sessionId is not defined');
  }

  const [openVidu] = useState<OpenVidu>(() => new OpenVidu());
  const [ovSession] = useState<Session>(() => openVidu.initSession());
  const publisherRef = useRef<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isRTCConnected, setIsRTCConnected] = useState<boolean>(false);

  const joinSession = useCallback(
    async (sessionId: string) => {
      ovSession.on('streamCreated', (event) => {
        const { clientData } = JSON.parse(event.stream.connection.data);
        const userName = localStorageApi.getUserName();
        if (clientData === userName) return;

        const subscriber = ovSession.subscribe(event.stream, undefined);

        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      ovSession.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) => {
          return prevSubscribers.filter(
            (sub) => sub !== event.stream.streamManager,
          );
        });
      });

      try {
        const { token } = await getConnectionToken(sessionId);
        if (!token) throw new Error('토큰이 정의되지 않았습니다');

        const username = localStorageApi.getUserName();
        await ovSession.connect(token, { clientData: username });
        const publisher = openVidu.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: false,
        });
        ovSession.publish(publisher);
        publisherRef.current = publisher;
        firstRender.current = false;
        setIsRTCConnected(true);
      } catch (error) {
        console.error('세션 연결 중 오류 발생:', (error as Error).message);
      }
    },
    [getConnectionToken, openVidu, ovSession],
  );

  const leaveSession = useCallback(async () => {
    if (ovSession) {
      ovSession.disconnect();
    }

    if (publisherRef.current) {
      const mediaStream = publisherRef.current.stream.getMediaStream();
      if (mediaStream && mediaStream.getTracks) {
        mediaStream
          .getTracks()
          .forEach((track: { stop: () => void }) => track.stop());
      }
    }

    setSubscribers(() => []);
    publisherRef.current = undefined;
  }, [ovSession]);

  useEffect(() => {
    joinSession(sessionId);

    return () => {
      leaveSession();
    };
  }, [joinSession, leaveSession, sessionId]);

  return (
    <WebRTCContext.Provider
      value={useMemo(
        () => ({
          openVidu,
          ovSession,
          publisher: publisherRef.current,
          subscribers,
          isConnected: isRTCConnected,
        }),
        [openVidu, ovSession, subscribers, isRTCConnected],
      )}
    >
      {children}
      {subscribers.map((subscriber, index) => (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          style={{
            width: 300,
            height: 300,
            border: '1px solid red',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 1000,
          }}
          key={subscriber.stream.streamId}
          id={`subscriberVideo${index}`}
          autoPlay
          ref={(video) => {
            if (video) {
              // eslint-disable-next-line no-param-reassign
              video.srcObject = subscriber.stream.getMediaStream();
            }
          }}
        />
      ))}
    </WebRTCContext.Provider>
  );
}
