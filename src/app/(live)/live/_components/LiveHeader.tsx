'use client';

// import { useStore } from '@/stores';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

import { UserIcon } from '@/components/UserIcon';
import { apiService } from '@/services/apiService';

import s from './LiveHeader.module.scss';

interface Props {
  sessionId: string;
  isLiveOn: boolean;
  streamerName: string;
  streamerProfileImage: string;
  isStreamer: boolean;
  onLeaveSession: () => void;
  onSwitchCamera: MouseEventHandler<HTMLButtonElement>;
}

export default function LiveHeader({
  sessionId,
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
        {isLiveOn && (
          <div className={s.liveFlagBox}>
            <p className={s.liveFlagText}>Live !</p>
          </div>
        )}
        <div className={s.viewerCountArea}>
          <Image
            src="/images/live/eye.svg"
            alt="viewer"
            width={16}
            height={16}
          />
          {/* ✅ TODO: back api와 연결 및 갱신로직 구현 */}
          <p className={s.viewersCount}>1</p>
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
        {isStreamer && (
          <StreamerButtons
            sessionId={sessionId}
            onLeaveSession={onLeaveSession}
            onSwitchCamera={onSwitchCamera}
          />
        )}
      </div>
    </header>
  );
}

interface StreamerButtonsProps {
  sessionId: string;
  onLeaveSession: () => void;
  onSwitchCamera: MouseEventHandler<HTMLButtonElement>;
}

function StreamerButtons({
  sessionId,
  onLeaveSession,
  onSwitchCamera,
}: StreamerButtonsProps) {
  return (
    // <div className={s.streamrButtons}>
    <>
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
      <button
        className={s.liveEndBtn}
        type="button"
        onClick={async () => {
          await apiService.removeLiveSession(sessionId);
          onLeaveSession();
        }}
      >
        방송 종료
      </button>
    </>
  );
}
