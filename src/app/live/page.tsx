'use client';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-depth */

import React, { FormEventHandler } from 'react';
import { apiService } from '@services/apiService';
import { useRouter } from 'next/navigation';

import s from './page.module.scss';

function StreamerPage() {
  const router = useRouter();

  const joinSession: FormEventHandler = async (e) => {
    e.preventDefault();

    const { sessionId } = await apiService.createSessionId();

    alert(sessionId);

    router.push(`/live/${sessionId}`);
  };

  return (
    <div>
      <div className={s.entryPageContainer}>
        <div className={s.entryPageHeaderWrapper} id="join-dialog">
          <h1 className={s.title}> 스트리밍 방 참가 페이지 </h1>
          <form className={s.joinInfoWrapper} onSubmit={joinSession}>
            <input name="commit" type="submit" value="세션 참여 !!" />
          </form>
        </div>
      </div>
    </div>
  );
}

// function StreamerPage() {
//   const [sessionName, setSessionName] = useState('a');
//   const [myUserName, setMyUserName] = useState(localStorageApi.getUserName());
//   const [session, setSession] = useState(undefined);
//   const [mainStreamManager, setMainStreamManager] = useState(undefined);
//   const [publisher, setPublisher] = useState(undefined);
//   const [isStreamer, setIsStreamer] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
//   const [OV, setOV] = useState(undefined);
//   const router = useRouter();

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
//     setSessionName(e.target.value);
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

//   const joinSession = async () => {
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
//         setMainStreamManager(subscriber); // 스트리머의 스트림을 메인 스트림 매니저로 설정
//       }
//     });

//     mySession.on('streamDestroyed', (event) => {
//       if (!isStreamer && mainStreamManager === event.stream.streamManager) {
//         setMainStreamManager(undefined);
//       }
//     });

//     mySession.on('exception', (exception) => {
//       console.warn(exception);
//     });

//     const { sessionId } = await apiService.createSessionId();

//     router.push(`/live/${sessionId}`);

//     setSessionName(sessionId);
//     console.log(sessionId);

//     await apiService.fetchToken(sessionId).then(({ token }) => {
//       console.log('token', token);

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
//             const videoDevices = devices.filter((device) => {
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
//     setMainStreamManager(undefined);
//     setPublisher(undefined);
//     setMessage('');
//     setMessages([]);
//     setSessionName('');
//     setMyUserName(`Participant${Math.floor(Math.random() * 100)}`);
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
//     const sessionId = await createSession(sessionName);
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
//                   value={sessionName}
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
//             <h1 id="session-title">{sessionName}</h1>
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
//             {mainStreamManager !== undefined ? (
//               <div
//                 className="stream-container col-md-6 col-xs-6"
//                 onClick={() => handleMainVideoStream(mainStreamManager)}
//               >
//                 <UserVideoComponent streamManager={mainStreamManager} />
//               </div>
//             ) : null}
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

export default StreamerPage;
