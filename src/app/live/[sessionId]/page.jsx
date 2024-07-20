/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-depth */

'use client';

// import { OpenVidu } from 'openvidu-browser';
// import React, { useState, useEffect, useCallback } from 'react';
// import { localStorageApi } from '@services/localStorageApi';
// import { apiService } from '@/services/apiService';
// import UserVideoComponent from '../UserVideoComponent';

// export default function StreamingPage({ params }) {
//   const { sessionId } = params;
//   const userName = localStorageApi.getUserName();
//   const [session, setSession] = useState(undefined);
//   const [mainStreamManager, setMainStreamManager] = useState(undefined);
//   const [publisher, setPublisher] = useState(undefined);
//   const [isStreamer, setIsStreamer] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
//   const [OV, setOV] = useState(undefined);

//   useEffect(() => {
//     const checkStreamer = async () => {
//       const { isCreator } =
//         await apiService.checkIsStreamerUserOfSession(sessionId);
//       setIsStreamer(isCreator);
//       await joinSession(isCreator);
//     };

//     checkStreamer();
//   }, [sessionId]);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       leaveSession();
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   const handleChatMessageChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const handleMainVideoStream = (stream) => {
//     if (mainStreamManager !== stream) {
//       setMainStreamManager(stream);
//     }
//   };

//   const joinSession = useCallback(async (isCreator) => {
//     if (!sessionId) return;

//     const OVInstance = new OpenVidu();
//     setOV(OVInstance);

//     const mySession = OVInstance.initSession();
//     setSession(mySession);

//     mySession.on('signal:chat', (event) => {
//       const message = {
//         user: event.from.data,
//         text: event.data,
//       };
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     mySession.on('streamCreated', (event) => {
//       if (!isCreator) {
//         const subscriber = mySession.subscribe(event.stream, undefined);
//         setMainStreamManager(subscriber); // 스트리머의 스트림을 메인 스트림 매니저로 설정
//       }
//     });

//     mySession.on('streamDestroyed', (event) => {
//       if (!isCreator && mainStreamManager === event.stream.streamManager) {
//         setMainStreamManager(undefined);
//       }
//     });

//     mySession.on('exception', (exception) => {
//       console.warn(exception);
//     });

//     const { token } = await apiService.fetchToken(sessionId);
//     mySession
//       .connect(token, { clientData: userName })
//       .then(async () => {
//         if (isCreator) {
//           const publisher = await OVInstance.initPublisherAsync(undefined, {
//             audioSource: undefined, // The source of audio. If undefined default microphone
//             videoSource: undefined, // The source of video. If undefined default webcam
//             publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
//             publishVideo: true, // Whether you want to start publishing with your video enabled or not
//             resolution: '640x480', // The resolution of your video
//             frameRate: 30, // The frame rate of your video
//             insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
//             mirror: false, // Whether to mirror your local video or not
//           });

//           mySession.publish(publisher);

//           const devices = await OVInstance.getDevices();
//           const videoDevices = devices.filter(
//             (device) => device.kind === 'videoinput',
//           );
//           const currentVideoDeviceId = publisher.stream
//             .getMediaStream()
//             .getVideoTracks()[0]
//             .getSettings().deviceId;
//           const currentVideoDevice = videoDevices.find(
//             (device) => device.deviceId === currentVideoDeviceId,
//           );

//           setCurrentVideoDevice(currentVideoDevice);
//           setMainStreamManager(publisher);
//           setPublisher(publisher);
//         }
//       })
//       .catch((error) => {
//         console.log(
//           'There was an error connecting to the session:',
//           error.code,
//           error.message,
//         );
//       });
//   }, []);

//   const leaveSession = useCallback(() => {
//     if (session) {
//       session.disconnect();
//     }
//     setOV(null);
//     setSession(undefined);
//     setMainStreamManager(undefined);
//     setPublisher(undefined);
//     setMessage('');
//     setMessages([]);
//   }, [session]);

//   const switchCamera = useCallback(async () => {
//     try {
//       const devices = await OV.getDevices();
//       const videoDevices = devices.filter(
//         (device) => device.kind === 'videoinput',
//       );

//       if (videoDevices.length > 1) {
//         const newVideoDevice = videoDevices.find(
//           (device) => device.deviceId !== currentVideoDevice.deviceId,
//         );

//         if (newVideoDevice) {
//           const newPublisher = OV.initPublisher(undefined, {
//             videoSource: newVideoDevice.deviceId,
//             publishAudio: true,
//             publishVideo: true,
//             mirror: true,
//           });

//           await session.unpublish(mainStreamManager);
//           await session.publish(newPublisher);
//           setCurrentVideoDevice(newVideoDevice);
//           setMainStreamManager(newPublisher);
//           setPublisher(newPublisher);
//         }
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }, [OV, currentVideoDevice, mainStreamManager, session]);

//   const handleSendChatMessage = (e) => {
//     e.preventDefault();
//     const trimmedMessage = message.trim();
//     if (trimmedMessage) {
//       session.signal({
//         data: trimmedMessage,
//         to: [],
//         type: 'chat',
//       });
//       setMessage('');
//     }
//   };

//   useEffect(() => {
//     if (mainStreamManager) {
//       // Check if mainStreamManager is updated and handle the re-render if necessary
//       console.log('mainStreamManager updated:', mainStreamManager);
//     }
//   }, [mainStreamManager]);

//   return (
//     <div>
//       <div id="session">
//         <div id="session-header">
//           <h1 id="session-title">{sessionId}</h1>
//           <input
//             className="btn btn-large btn-danger"
//             type="button"
//             id="buttonLeaveSession"
//             onClick={leaveSession}
//             value="Leave session"
//           />
//           {isStreamer && (
//             <input
//               className="btn btn-large btn-success"
//               type="button"
//               id="buttonSwitchCamera"
//               onClick={switchCamera}
//               value="Switch Camera"
//             />
//           )}
//         </div>
//         <div id="video-container" className="col-md-6">
//           {mainStreamManager !== undefined ? (
//             <div
//               className="stream-container col-md-6 col-xs-6"
//               onClick={() => handleMainVideoStream(mainStreamManager)}
//             >
//               <UserVideoComponent streamManager={mainStreamManager} />
//             </div>
//           ) : (
//             <div>스트리머의 비디오를 기다리는 중...</div>
//           )}
//         </div>

//         <div id="chat-container" className="col-md-6">
//           <div id="chat-box">
//             {messages.map((message, i) => (
//               <div key={`msg-${i}`} className="chat-message">
//                 <strong>{message.user}</strong>: {message.text}
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleSendChatMessage}>
//             <input
//               type="text"
//               className="form-control"
//               value={message}
//               onChange={handleChatMessageChange}
//               placeholder="Type a message..."
//             />
//             <button className="btn btn-primary" type="submit">
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable react/no-array-index-key */
// /* eslint-disable no-shadow */
// /* eslint-disable react/jsx-filename-extension */
// /* eslint-disable max-depth */

// 'use client';

// import { OpenVidu } from 'openvidu-browser';
// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import '../App.css';
// import UserVideoComponent from '../UserVideoComponent';
// import '../index.css';
// import { apiService } from '@/services/apiService';

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://wagubook.shop/'
//     : 'https://demos.openvidu.io/';

// function App({ params: { sessionId } }) {
//   const [mySessionId, setMySessionId] = useState('SessionA');
//   const [myUserName, setMyUserName] = useState(
//     `Participant + ${Math.floor(Math.random() * 100)}`,
//   );
//   const [session, setSession] = useState(undefined);
//   const [mainStreamManager, setMainStreamManager] = useState(undefined);
//   const [publisher, setPublisher] = useState(undefined);
//   const [subscribers, setSubscribers] = useState([]);
//   const [isStreamer, setIsStreamer] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
//   const [OV, setOV] = useState(undefined);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       leaveSession();
//     };
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   const handleChangeSessionId = (e) => {
//     setMySessionId(e.target.value);
//   };

//   const handleChangeUserName = (e) => {
//     setMyUserName(e.target.value);
//   };

//   const handleStreamerChange = (e) => {
//     setIsStreamer(e.target.checked);
//   };

//   const handleChatMessageChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const handleMainVideoStream = (stream) => {
//     if (mainStreamManager !== stream) {
//       setMainStreamManager(stream);
//     }
//   };

//   const deleteSubscriber = (streamManager) => {
//     setSubscribers((prevSubscribers) => {
//       return prevSubscribers.filter((sub) => sub !== streamManager);
//     });
//   };

//   const joinSession = useCallback(() => {
//     const OVInstance = new OpenVidu();
//     setOV(OVInstance);

//     const mySession = OVInstance.initSession();
//     setSession(mySession);

//     mySession.on('signal:chat', (event) => {
//       const message = {
//         user: event.from.data,
//         text: event.data,
//       };
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     mySession.on('streamCreated', (event) => {
//       if (!isStreamer) {
//         const subscriber = mySession.subscribe(event.stream, undefined);
//         setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
//       }
//     });

//     mySession.on('streamDestroyed', (event) => {
//       deleteSubscriber(event.stream.streamManager);
//     });

//     mySession.on('exception', (exception) => {
//       console.warn(exception);
//     });
//     // getToken().then((token) => {

//     apiService.fetchToken(mySessionId).then(({ token }) => {
//       mySession
//         .connect(token, { clientData: myUserName })
//         .then(async () => {
//           if (isStreamer) {
//             const publisher = await OVInstance.initPublisherAsync(undefined, {
//               audioSource: undefined,
//               videoSource: undefined,
//               publishAudio: true,
//               publishVideo: true,
//               resolution: '640x480',
//               frameRate: 30,
//               insertMode: 'APPEND',
//               mirror: false,
//             });

//             mySession.publish(publisher);

//             const devices = await OVInstance.getDevices();
//             console.log('page.jsx::122 devices :', devices);
//             const videoDevices = devices.filter(
//               (device) => device.kind === 'videoinput',
//             );
//             const currentVideoDeviceId = publisher.stream
//               .getMediaStream()
//               .getVideoTracks()[0]
//               .getSettings().deviceId;
//             const currentVideoDevice = videoDevices.find(
//               (device) => device.deviceId === currentVideoDeviceId,
//             );

//             setCurrentVideoDevice(currentVideoDevice);
//             setMainStreamManager(publisher);
//             setPublisher(publisher);
//           }
//         })
//         .catch((error) => {
//           console.log(
//             'There was an error connecting to the session:',
//             error.code,
//             error.message,
//           );
//         });
//     });
//   }, [isStreamer, myUserName, mySessionId]);

//   const leaveSession = useCallback(() => {
//     if (session) {
//       session.disconnect();
//     }
//     setOV(null);
//     setSession(undefined);
//     setSubscribers([]);
//     setMySessionId('SessionA');
//     setMyUserName(`Participant${Math.floor(Math.random() * 100)}`);
//     setMainStreamManager(undefined);
//     setPublisher(undefined);
//     setMessage('');
//     setMessages([]);
//   }, [session]);

//   const switchCamera = useCallback(async () => {
//     try {
//       const devices = await OV.getDevices();
//       const videoDevices = devices.filter(
//         (device) => device.kind === 'videoinput',
//       );

//       if (videoDevices.length > 1) {
//         const newVideoDevice = videoDevices.find(
//           (device) => device.deviceId !== currentVideoDevice.deviceId,
//         );

//         if (newVideoDevice) {
//           const newPublisher = OV.initPublisher(undefined, {
//             videoSource: newVideoDevice.deviceId,
//             publishAudio: true,
//             publishVideo: true,
//             mirror: true,
//           });

//           await session.unpublish(mainStreamManager);
//           await session.publish(newPublisher);
//           setCurrentVideoDevice(newVideoDevice);
//           setMainStreamManager(newPublisher);
//           setPublisher(newPublisher);
//         }
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }, [OV, currentVideoDevice, mainStreamManager, session]);

//   const handleSendChatMessage = (e) => {
//     e.preventDefault();
//     const trimmedMessage = message.trim();
//     if (trimmedMessage) {
//       session.signal({
//         data: trimmedMessage,
//         to: [],
//         type: 'chat',
//       });
//       setMessage('');
//     }
//   };

//   const getToken = async () => {
//     const sessionId = await createSession(mySessionId);
//     return createToken(sessionId);
//   };

//   const createSession = async (sessionId) => {
//     const response = await axios.post(
//       `${APPLICATION_SERVER_URL}api/sessions`,
//       { customSessionId: sessionId },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );

//     console.log(response.data);

//     return response.data; // The sessionId
//   };

//   const createToken = async (sessionId) => {
//     const response = await axios.post(
//       `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
//       {},
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );
//     return response.data; // The token
//   };

//   return (
//     <div className="container">
//       {session === undefined ? (
//         <div id="join">
//           <div id="join-dialog" className="jumbotron vertical-center">
//             <h1> 후원 감사합니다. </h1>
//             <form className="form-group" onSubmit={joinSession}>
//               <p>
//                 <label htmlFor="userName">참가자: </label>
//                 <input
//                   className="form-control"
//                   type="text"
//                   id="userName"
//                   value={myUserName}
//                   onChange={handleChangeUserName}
//                   required
//                 />
//               </p>
//               <p>
//                 <label htmlFor="sessionId"> Session: </label>
//                 <input
//                   className="form-control"
//                   type="text"
//                   id="sessionId"
//                   value={mySessionId}
//                   onChange={handleChangeSessionId}
//                   required
//                 />
//               </p>
//               <p>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={isStreamer}
//                     onChange={handleStreamerChange}
//                   />
//                   Streamer
//                 </label>
//               </p>
//               <p className="text-center">
//                 <input
//                   className="btn btn-lg btn-success"
//                   name="commit"
//                   type="submit"
//                   value="세션 참여 !!"
//                 />
//               </p>
//             </form>
//           </div>
//         </div>
//       ) : null}

//       {session !== undefined ? (
//         <div id="session">
//           <div id="session-header">
//             <h1 id="session-title">{mySessionId}</h1>
//             <input
//               className="btn btn-large btn-danger"
//               type="button"
//               id="buttonLeaveSession"
//               onClick={leaveSession}
//               value="Leave session"
//             />
//             {isStreamer && (
//               <input
//                 className="btn btn-large btn-success"
//                 type="button"
//                 id="buttonSwitchCamera"
//                 onClick={switchCamera}
//                 value="Switch Camera"
//               />
//             )}
//           </div>
//           <div id="video-container" className="col-md-6">
//             {publisher !== undefined && isStreamer ? (
//               <div
//                 className="stream-container col-md-6 col-xs-6"
//                 onClick={() => handleMainVideoStream(publisher)}
//               >
//                 <UserVideoComponent streamManager={publisher} />
//               </div>
//             ) : null}
//             {subscribers.map((sub) => (
//               <div
//                 key={sub.id}
//                 className="stream-container col-md-6 col-xs-6"
//                 onClick={() => handleMainVideoStream(sub)}
//               >
//                 <span>{sub.id}</span>
//                 <UserVideoComponent streamManager={sub} />
//               </div>
//             ))}
//           </div>

//           <div id="chat-container" className="col-md-6">
//             <div id="chat-box">
//               {messages.map((message, i) => (
//                 <div key={`msg-${i}`} className="chat-message">
//                   <strong>{message.user}</strong>: {message.text}
//                 </div>
//               ))}
//             </div>
//             <form onSubmit={handleSendChatMessage}>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={message}
//                 onChange={handleChatMessageChange}
//                 placeholder="Type a message..."
//               />
//               <button className="btn btn-primary" type="submit">
//                 Send
//               </button>
//             </form>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default App;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
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

import { OpenVidu, Publisher, Subscriber } from 'openvidu-browser';
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
  const [isStreamer, setIsStreamer] = useState(false);

  const [OV, setOV] = useState(undefined);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [subscriber, setSubscriber] = useState(null);
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
    console.log('----- 3');

    const OVInstance = new OpenVidu();
    setOV(OVInstance);

    const OVSession = OVInstance.initSession();
    setSession(OVSession);
    console.log('----- 4');

    OVSession.on('signal:chat', (event) => {
      const message = {
        user: event.from.data,
        text: event.data,
      };
      console.log('----- 5');

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    OVSession.on('streamCreated', async (event) => {
      console.log('-----6 [SIGNAL][streamCreated]');

      const subscriber = OVSession.subscribe(event.stream, undefined);
      // setMainStreamManager(subscriber); // 스트리머의 스트림을 메인 스트림 매니저로 설정
      setSubscriber(subscriber);
    });

    OVSession.on('streamDestroyed', (event) => {
      if (!isStreamer && mainStreamManager === event.stream.streamManager) {
        setMainStreamManager(undefined);
      }
    });

    OVSession.on('exception', (exception) => {
      console.warn(exception);
    });

    apiService.fetchToken(sessionId).then(({ token }) => {
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
    // .then(({ token }) => {
    // mySession.connect(token, { clientData: userName })
    //   .then(async () => {
    //     if (isCreator) {
    //       const publisher = await OVInstance.initPublisherAsync(undefined, {
    //         audioSource: undefined,
    //         videoSource: undefined,
    //         publishAudio: true,
    //         publishVideo: true,
    //         resolution: '640x480',
    //         frameRate: 30,
    //         insertMode: 'APPEND',
    //         mirror: false,
    //       });
    //     }});

    //     mySession.publish(publisher);
    //     const devices = await OVInstance.getDevices();
    //     const videoDevices = devices.filter((device) => {
    //       return device.kind === 'videoinput';
    //     });
    //     const currentVideoDeviceId = publisher.stream
    //       .getMediaStream()
    //       .getVideoTracks()[0]
    //       .getSettings().deviceId;
    //     const currentVideoDevice = videoDevices.find(
    //       (device) => device.deviceId === currentVideoDeviceId,
    //     );

    //     setCurrentVideoDevice(currentVideoDevice);
    //     setMainStreamManager(publisher);
    //     setPublisher(publisher);

    // });
    // // .catch((error) => {
    // //   console.log(
    // //     'There was an error connecting to the session:',
    // //     error.code,
    // //     error.message,
    // //   );
    // // });
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

        // if (newVideoDevice) {
        //   const newPublisher = OV.initPublisher(undefined, {
        //     videoSource: newVideoDevice.deviceId,
        //     publishAudio: true,
        //     publishVideo: true,
        //     mirror: true,
        //   });

        //   await session.unpublish(mainStreamManager);
        //   await session.publish(newPublisher);
        //   setCurrentVideoDevice(newVideoDevice);
        //   setMainStreamManager(newPublisher);
        //   setPublisher(newPublisher);
        // }
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

  console.log('mainStreamManager :', mainStreamManager);
  console.log(
    'main 스트리머 매니저 instanceof 섭스크라이버',
    mainStreamManager instanceof Subscriber,
  );
  console.log(
    'main 스트리머 매니저 instanceof 퍼블리셔',
    mainStreamManager instanceof Publisher,
  );

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
          {mainStreamManager !== undefined && isStreamer ? (
            <div
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(mainStreamManager)}
            >
              스트리머다
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : (
            subscriber !== null &&
            !isStreamer && (
              <div
                className="stream-container col-md-6 col-xs-6"
                onClick={() => handleMainVideoStream(subscriber)}
              >
                섭스다
                <UserVideoComponent streamManager={subscriber} />
              </div>
            )
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
