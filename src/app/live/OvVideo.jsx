/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/media-has-caption */

'use client';

import React, { useEffect, useRef } from 'react';

export default function OpenViduVideoComponent({ streamManager }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return <video autoPlay ref={videoRef} />;
}
