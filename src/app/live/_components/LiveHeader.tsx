'use client';

// import { useStore } from '@/stores';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

import { UserIcon } from '@/components/UserIcon';

import s from './LiveHeader.module.scss';

interface Props {
  isLiveOn: boolean;
  streamerName: string;
  streamerProfileImage: string;
  isStreamer: boolean;
  onLeaveSession: () => void;
  onSwitchCamera: MouseEventHandler<HTMLButtonElement>;
}

export default function LiveHeader({
  isLiveOn,
  streamerName,
  streamerProfileImage,
  isStreamer,
  onLeaveSession,
  onSwitchCamera,
}: Props) {
  // const isStreamer = useStore((state) => state.isStreamer);

  return (
    <header className={s.container}>
      <div className={s.streamerInfoArea}>
        <UserIcon
          imgSrc={streamerProfileImage}
          shape="circle"
          alt={streamerName}
          size="xSmall"
        />
        <p className={s.streamerName}>{streamerName}</p>
      </div>
      <div className={s.buttonsWrapper}>
        {isStreamer && (
          <StreamerButtons
            onLeaveSession={onLeaveSession}
            onSwitchCamera={onSwitchCamera}
          />
        )}
        {isLiveOn && (
          <div className={s.liveFlagBox}>
            <p className={s.liveFlagText}>Live!</p>
          </div>
        )}
        <div className={s.viewerCountArea}>
          <Image
            src="/images/live/eye.svg"
            alt="viewer"
            width={16}
            height={16}
          />
          <p className={s.viewersCount}>30</p>
        </div>
        {!isStreamer && isLiveOn && (
          <button
            className={s.leaveLiveBtn}
            type="button"
            onClick={onLeaveSession}
          >
            <Image
              src="/images/live/close_x.svg"
              alt="live-end"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
    </header>
  );
}

interface StreamerButtonsProps {
  onLeaveSession: () => void;
  onSwitchCamera: MouseEventHandler<HTMLButtonElement>;
}

function StreamerButtons({
  onLeaveSession,
  onSwitchCamera,
}: StreamerButtonsProps) {
  return (
    // <div className={s.streamrButtons}>
    <>
      <button className={s.liveEndBtn} type="button" onClick={onLeaveSession}>
        방송 종료
      </button>
      <button
        className={s.switchCameraBtn}
        type="button"
        onClick={onSwitchCamera}
      >
        <Image
          src="/images/live/camera_switch.svg"
          alt="switch camera"
          width={16}
          height={16}
        />
      </button>
    </>
    // </div>
  );
}
