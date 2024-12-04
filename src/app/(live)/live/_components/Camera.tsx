'use client';

import { useEffect, useRef } from 'react';

/**
 * ⛔️ mobile device에서 카메라 접근은 확인했습니다.
 *    그러나 ios version에 따라서 카메라 접근이 되지 않는 경우가 있습니다.
 *
 *    확인된 device : iphone 13 pro(17.5.1), 혁준폰
 *    미작동 device : 수현폰
 *
 * ✅ TODO : custom hook을 분리한다.
 */
export default function Camera({ isCameraOn }: { isCameraOn: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        ...(isCameraOn ? STYLE.CONTAINER.CAMERA_ON : {}),
      }}
    >
      {isCameraOn ? (
        <video
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          ref={videoRef}
          autoPlay
          muted
        />
      ) : null}
    </div>
  );
}

const STYLE = {
  CONTAINER: {
    CAMERA_ON: {
      borderRadius: '16px',
      boxShadow: '8px 8px 16px 0px rgba(0, 0, 0, 0.20)',
    },
  },
};

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
