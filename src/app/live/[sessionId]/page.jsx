/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-depth */

'use client';

import { OpenVidu } from 'openvidu-browser';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { localStorageApi } from '@services/localStorageApi';
import { apiService } from '@/services/apiService';
import LiveHeader from '../_components/LiveHeader';
import UserVideoComponent from '../UserVideoComponent';

import s from './page.module.scss';

export default function StreamingPage({ params }) {
  const { sessionId } = params;
  const userName = localStorageApi.getUserName();
  const router = useRouter();
  const [isStreamer, setIsStreamer] = useState(false);

  const [OV, setOV] = useState(undefined);
  const [isLiveOn, setIsLiveOn] = useState(true);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const checkStreamer = async () => {
      const { isCreator: isStreamer } =
        await apiService.checkIsStreamerUserOfSession(sessionId);
      setIsStreamer(isStreamer);
    };

    checkStreamer();
    joinSession();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleLeaveSessionClick();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleChatMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const joinSession = useCallback(async () => {
    if (!sessionId) {
      alert('session id가 없어요 !');
      return;
    }

    const OVInstance = new OpenVidu();
    setOV(OVInstance);

    const OVSession = OVInstance.initSession();
    setSession(OVSession);

    OVSession.on('signal:chat', (event) => {
      const message = {
        user: event.from.data,
        text: event.data,
      };

      console.log(message);

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    OVSession.on('streamCreated', async (event) => {
      console.log('-----6 [SIGNAL][streamCreated]');

      const subscriber = OVSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    OVSession.on('streamDestroyed', (event) => {
      if (!isStreamer && mainStreamManager === event.stream.streamManager) {
        setMainStreamManager(undefined);
      }
    });

    OVSession.on('exception', (exception) => {
      console.warn(exception);
    });

    apiService.fetchStreamingToken(sessionId).then(({ token }) => {
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      console.log(token);
      OVSession.connect(token, { clientData: userName })
        .then(async () => {
          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          const publisher = await OVInstance.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });
          // --- 6) Publish your stream ---

          OVSession.publish(publisher);

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

          // Set the main video in the page to display our webcam and store our Publisher
          setCurrentVideoDevice(currentVideoDevice);
          setMainStreamManager(publisher);
          setPublisher(publisher);
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

  const handleLeaveSessionClick = useCallback(async () => {
    if (session) {
      session.disconnect();
    }
    setOV(undefined);
    setSession(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setMessage('');
    setMessages([]);

    apiService.removeLiveSession(sessionId);

    router.push('/');
  }, [session]);

  const handleSwitchCameraClick = useCallback(async () => {
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
  }, []);

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

  return (
    <>
      <LiveHeader
        isLiveOn={isLiveOn}
        isStreamer={isStreamer}
        streamerName="왕도끼"
        streamerProfileImage="/profile/profile-default-icon-female.svg"
        onLeaveSession={handleLeaveSessionClick}
        onSwitchCamera={handleSwitchCameraClick}
      />
      <main className={s.container}>
        <div className={s.streamerVideoWrapper}>
          {mainStreamManager !== undefined && isStreamer ? (
            <UserVideoComponent streamManager={mainStreamManager} />
          ) : (
            subscribers !== null &&
            !isStreamer && <UserVideoComponent streamManager={subscribers[0]} />
          )}
        </div>
        <div className={s.chatBoxContianer}>
          <div className={s.chatBoxWrapper}>
            {messages.map(({ user, text }, i) => {
              const userName = JSON.parse(user).clientData;

              return (
                <div key={`msg-${i}`} className={s.chatArea}>
                  <span className={s.userImg}>
                    <Image
                      src="/profile/profile-default-icon-male.svg"
                      alt="user"
                      width={26}
                      height={26}
                    />
                  </span>
                  <div className={s.msgArea}>
                    <p className={s.userName}>{userName}</p>
                    <p className={s.msg}>{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={s.chatInputContainer}>
            <form
              className={s.chatInputWrapper}
              onSubmit={handleSendChatMessage}
            >
              <input
                className={s.chatInput}
                type="text"
                value={message}
                onChange={handleChatMessageChange}
                placeholder="Type a message..."
              />
              <button className={s.msgSendBtn} type="submit">
                <Image
                  src="/images/live/send_airplain.svg"
                  alt="send"
                  width={24}
                  height={24}
                />
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
