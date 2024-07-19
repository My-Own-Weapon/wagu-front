/* eslint-disable no-useless-return */
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

  const userName = localStorageApi.getUserName();

  // const [myUserName, setMyUserName] = useState(localStorageApi.getUserName());
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

      console.log('@@@@@ 1');
      console.log('isCreator :', isCreator);

      setIsStreamer(isCreator);
      await joinSession();
    };

    checkStreamer();
  }, []);

  useEffect(() => {
    console.log('@@@@@ 2');

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
    console.log('@@@@@ 3');

    const OVInstance = new OpenVidu();
    setOV(OVInstance);

    const mySession = OVInstance.initSession();
    setSession(mySession);
    console.log('@@@@@ 4');

    mySession.on('signal:chat', (event) => {
      const message = {
        user: event.from.data,
        text: event.data,
      };
      console.log('@@@@@ 5');

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    mySession.on('streamCreated', (event) => {
      console.log('streamCreated event!!!! isCreator :', isStreamer);
      console.log('@@@@@ 6');

      if (!isStreamer) {
        console.log('_-----------------subscrib로 등록');

        const subscriber = mySession.subscribe(event.stream, undefined);
        setMainStreamManager(subscriber); // 스트리머의 스트림을 메인 스트림 매니저로 설정
        return;
      }
      console.log('_---------------나 퍼블리셔임 ㅋ');
    });

    mySession.on('streamDestroyed', (event) => {
      console.log('@@@@@ 8');

      if (!isStreamer && mainStreamManager === event.stream.streamManager) {
        setMainStreamManager(undefined);
      }
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    // streamer, participant 구분
    const { isCreator } =
      await apiService.checkIsStreamerUserOfSession(sessionId);
    // console.log('isStreamer :', isStreamer);
    console.log('@@@@@ 9');

    apiService.fetchToken(sessionId).then(({ token }) => {
      mySession
        .connect(token, { clientData: userName })
        .then(async () => {
          if (isCreator) {
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
    // setMyUserName('');
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

  console.log('mainStreamManager :', mainStreamManager);

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
          ) : (
            <div>스트리머의 비디오를 기다리는 중...</div>
          )}
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
