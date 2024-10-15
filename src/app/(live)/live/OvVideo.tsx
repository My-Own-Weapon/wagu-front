/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/media-has-caption */

'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  streamManager: any;
}

function OpenViduVideoComponent({ streamManager }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  useEffect(() => {
    if (!videoRef.current) return;

    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Mobile') > -1) {
      videoRef.current.style.left = '-40px';
    } else {
      videoRef.current.style.left = '-410px';
    }
  }, [streamManager]);

  return (
    <video
      style={{
        position: 'absolute',
        left: '-410px',
        height: '100dvh',
      }}
      autoPlay
      ref={videoRef}
    />
  );
}

export default OpenViduVideoComponent;
