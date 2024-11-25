import { useCallback, useEffect, useState } from 'react';
import { OpenVidu, Publisher, StreamEvent, Subscriber } from 'openvidu-browser';
import { useGetRTCConnectionToken } from '@/feature/webRTC/applications/hooks';
import { localStorageApi } from '@/services/localStorageApi';

const useJoinVoiceCall = ({ sessionId }: { sessionId: string }) => {
  const [openVidu] = useState(() => new OpenVidu());
  const [ovSession] = useState(() => openVidu.initSession());
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const { getConnectionToken } = useGetRTCConnectionToken();

  const joinVoiceCall = useCallback(
    async (sessionId: string) => {
      ovSession.on('streamCreated', (event: StreamEvent) => {
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
        const username = localStorageApi.getUserName();
        const { token } = await getConnectionToken(sessionId);

        await ovSession.connect(token, { clientData: username });

        const publisher = openVidu.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: false,
        });

        ovSession.publish(publisher);
        setPublisher(publisher);
      } catch (error) {
        console.error('세션 연결 중 오류 발생:', (error as Error).message);
      }
    },
    [getConnectionToken, ovSession, openVidu],
  );

  const leaveVoiceCall = useCallback(() => {
    if (ovSession) {
      ovSession.disconnect();
    }

    if (publisher) {
      const mediaStream = publisher.stream.getMediaStream();
      if (mediaStream && mediaStream.getTracks) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    }

    setSubscribers(() => []);
    setPublisher(undefined);
  }, [ovSession, publisher]);

  useEffect(() => {
    joinVoiceCall(sessionId);

    window.addEventListener('beforeunload', () => {
      leaveVoiceCall();
    });

    return () => {
      window.removeEventListener('beforeunload', () => {
        leaveVoiceCall();
      });
    };
  }, [joinVoiceCall, leaveVoiceCall, sessionId]);

  return { publisher, subscribers };
};

export default useJoinVoiceCall;
