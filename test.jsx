// 'use client';

// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable react/no-array-index-key */
// /* eslint-disable no-shadow */
// /* eslint-disable react/jsx-filename-extension */
// /* eslint-disable max-depth */

// import { OpenVidu } from 'openvidu-browser';
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import UserVideoComponent from './UserVideoComponent';

// import s from './page.module.scss';

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://wagubook.shop/'
//     : 'https://demos.openvidu.io/';

// function App() {
//   const [mySessionId, setMySessionId] = useState('SessionA');
//   const [myUserName, setMyUserName] = useState(
//     Participant + ${Math.floor(Math.random() * 100)},
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

//   const joinSession = () => {
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

//     getToken().then((token) => {
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
//             const videoDevices = devices.filter((device) => {
//               console.log('[OVinstance.getDevices] device : ', device);
//               return device.kind === 'videoinput';
//             });
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
//   };

//   const leaveSession = () => {
//     if (session) {
//       session.disconnect();
//     }
//     setOV(null);
//     setSession(undefined);
//     setSubscribers([]);
//     setMySessionId('SessionA');
//     setMyUserName(Participant${Math.floor(Math.random() * 100)});
//     setMainStreamManager(undefined);
//     setPublisher(undefined);
//     setMessage('');
//     setMessages([]);
//   };

//   const switchCamera = async () => {
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
//   };

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
//       ${APPLICATION_SERVER_URL}api/sessions,
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
//       ${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections,
//       {},
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );
//     return response.data; // The token
//   };

//   return (
//     <div>
//       {session === undefined ? (
//         <div className={s.entryPageContainer}>
//           <div className={s.entryPageHeaderWrapper} id="join-dialog">
//             <h1 className={s.title}> 스트리밍 방 참가 페이지 </h1>
//             <form className={s.joinInfoWrapper} onSubmit={joinSession}>
//               <label htmlFor="userName">
//                 참가자:
//                 <input
//                   type="text"
//                   id="userName"
//                   value={myUserName}
//                   onChange={handleChangeUserName}
//                   required
//                 />
//               </label>
//               <br />
//               <label htmlFor="sessionId">
//                 Session:
//                 <input
//                   type="text"
//                   id="sessionId"
//                   value={mySessionId}
//                   onChange={handleChangeSessionId}
//                   required
//                 />
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={isStreamer}
//                   onChange={handleStreamerChange}
//                 />
//                 Streamer
//               </label>
//               <br />
//               <input name="commit" type="submit" value="세션 참여 !!" />
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
//                 <div>이건 스트리머 비디오 태그다 !</div>
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
//                 <div key={msg-${i}} className="chat-message">
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
