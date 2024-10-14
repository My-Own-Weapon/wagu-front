'use client';

import { BoxButton } from '@/components/ui';
import { useEffect, useReducer, useRef } from 'react';

/**
 * ⛔️ mobile device에서 카메라 접근은 확인했습니다.
 *    그러나 ios version에 따라서 카메라 접근이 되지 않는 경우가 있습니다.
 *
 *    확인된 device : iphone 13 pro(17.5.1), 혁준폰
 *    미작동 device : 수현폰
 *
 * ✅ TODO : custom hook을 분리한다.
 */
export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, toggleCamera] = useReducer((state) => !state, false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (!videoRef.current) return;

        videoRef.current.srcObject = isCameraOn ? stream : null;
      } catch (error) {
        alert(`Error accessing camera (reason : ${error})`);
      }
    };

    initCamera();

    const currentVideoRef = videoRef.current;

    return () => {
      if (currentVideoRef && currentVideoRef.srcObject instanceof MediaStream) {
        const tracks = currentVideoRef.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    if (!videoRef.current) return;

    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Mobile') > -1) {
      videoRef.current.style.left = '-40px';
    } else {
      videoRef.current.style.left = '-410px';
    }
  }, [isCameraOn]);

  const handleClickCameraOnOff = () => {
    toggleCamera();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {isCameraOn ? (
        <video
          style={{
            position: 'absolute',
            left: '-410px',
            height: '100dvh',
          }}
          ref={videoRef}
          autoPlay
          muted
        />
      ) : null}

      <BoxButton onClick={handleClickCameraOnOff} styleType="outline">
        {isCameraOn ? '카메라 테스트 종료' : '카메라 테스트 시작'}
      </BoxButton>
    </div>
  );
}

/**
 *  ✅ TODO: file 시스템을 이용해서 mobile device에서 카메라 접근을 확인했으나
 *           이를 어떻게 사용해야할지는 아직 미정입니다.
 */
// import { ChangeEventHandler, useRef } from 'react';

// interface CameraComponentProps {
//   onCapture: (file: File) => void;
// }

// function CameraComponent({ onCapture }: CameraComponentProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       onCapture(file);
//     }
//   };

//   const openCamera = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept="image/*"
//         capture="environment"
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//         onChange={handleFileChange}
//       />
//       <button type="button" onClick={openCamera}>
//         Open Camera
//       </button>
//     </div>
//   );
// }

// export default CameraComponent;
