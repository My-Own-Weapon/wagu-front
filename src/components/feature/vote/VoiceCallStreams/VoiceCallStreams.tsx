import { Subscriber } from 'openvidu-browser';
import { useCallback } from 'react';

interface Props {
  subscribers: Subscriber[];
}

export default function VoiceCallStreams({ subscribers }: Props) {
  const onLoadVideo = useCallback(
    (videoNode: HTMLVideoElement | null, subscriber: Subscriber) => {
      if (!videoNode) return;

      // eslint-disable-next-line no-param-reassign
      videoNode.srcObject = subscriber.stream.getMediaStream();
    },
    [],
  );

  return subscribers.map((subscriber, index) => (
    <video
      key={subscriber.stream.streamId}
      id={`subscriberVideo${index}`}
      autoPlay
      ref={(videoNode) => onLoadVideo(videoNode, subscriber)}
    >
      <track kind="captions" />
    </video>
  ));
}
