/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-depth */
// /* eslint-disable no-shadow */
// 'use client';

'use client';

import { OpenVidu } from 'openvidu-browser';
import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from 'react';
import { localStorageApi } from '@services/localStorageApi';
import { apiService } from '@/services/apiService';
import UserVideoComponent from '../UserVideoComponent';

export default function StreamingPage({ params }) {
  const { sessionId } = params;
  console.log('params sessionId : ', sessionId);

  const userName = localStorageApi.getUserName();

  const [myUserName, setMyUserName] = useState(localStorageApi.getUserName());
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [isStreamer, setIsStreamer] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [OV, setOV] = useState(undefined);

  useEffect(() => {
    const checkStreamer = async () => {
      const { isCreator } =
        await apiService.checkIsStreamerUserOfSession(sessionId);

      console.log('isStreamer :', isCreator);

      setIsStreamer(isCreator);
    };

    checkStreamer();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleChatMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const joinSession = useCallback(async () => {
    if (!sessionId) return;

    const OVInstance = new OpenVidu();
    setOV(OVInstance);

    const mySession = OVInstance.initSession();
    setSession(mySession);

    mySession.on('signal:chat', (event) => {
      const message = {
        user: event.from.data,
        text: event.data,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    mySession.on('streamCreated', (event) => {
      if (!isStreamer) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setMainStreamManager(subscriber); // 스트리머의 스트림을 메인 스트림 매니저로 설정
      }
    });

    mySession.on('streamDestroyed', (event) => {
      if (!isStreamer && mainStreamManager === event.stream.streamManager) {
        setMainStreamManager(undefined);
      }
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    // streamer, participant 구분
    const isStreamer = await apiService.checkIsStreamerUserOfSession(sessionId);
    console.log('isStreamer :', isStreamer);

    apiService.fetchToken(sessionId).then(({ token }) => {
      mySession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          if (isStreamer) {
            console.log('@@@ 실행됨');

            const publisher = await OVInstance.initPublisherAsync(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              resolution: '640x480',
              frameRate: 30,
              insertMode: 'APPEND',
              mirror: false,
            });

            mySession.publish(publisher);

            const devices = await OVInstance.getDevices();
            const videoDevices = devices.filter((device) => {
              return device.kind === 'videoinput';
            });
            const currentVideoDeviceId = publisher.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .getSettings().deviceId;
            const currentVideoDevice = videoDevices.find(
              (device) => device.deviceId === currentVideoDeviceId,
            );

            setCurrentVideoDevice(currentVideoDevice);
            setMainStreamManager(publisher);
            setPublisher(publisher);
          }
        })
        .catch((error) => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message,
          );
        });
    });
  }, []);

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    setOV(null);
    setSession(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setMessage('');
    setMessages([]);
    setMyUserName('');
  }, [session]);

  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );

      if (videoDevices.length > 1) {
        const newVideoDevice = videoDevices.find(
          (device) => device.deviceId !== currentVideoDevice.deviceId,
        );

        if (newVideoDevice) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice.deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);
          setCurrentVideoDevice(newVideoDevice);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [OV, currentVideoDevice, mainStreamManager, session]);

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      session.signal({
        data: trimmedMessage,
        to: [],
        type: 'chat',
      });
      setMessage('');
    }
  };

  useEffect(() => {
    if (sessionId) {
      joinSession();
    }
  }, []);

  return (
    <div>
      <div id="session">
        <div id="session-header">
          <h1 id="session-title">{sessionId}</h1>
          <input
            className="btn btn-large btn-danger"
            type="button"
            id="buttonLeaveSession"
            onClick={leaveSession}
            value="Leave session"
          />
          {isStreamer && (
            <input
              className="btn btn-large btn-success"
              type="button"
              id="buttonSwitchCamera"
              onClick={switchCamera}
              value="Switch Camera"
            />
          )}
        </div>
        <div id="video-container" className="col-md-6">
          {mainStreamManager !== undefined ? (
            <div
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(mainStreamManager)}
            >
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
        </div>

        <div id="chat-container" className="col-md-6">
          <div id="chat-box">
            {messages.map((message, i) => (
              <div key={`msg-${i}`} className="chat-message">
                <strong>{message.user}</strong>: {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChatMessage}>
            <input
              type="text"
              className="form-control"
              value={message}
              onChange={handleChatMessageChange}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
