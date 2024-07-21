/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/media-has-caption */

'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  streamManager: any;
}

function OpenViduVideoComponent({ streamManager }: Props) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <video
      style={{
        height: '100dvh',
      }}
      autoPlay
      ref={videoRef}
    />
  );
}

export default OpenViduVideoComponent;
