'use client';

// import { useStore } from '@/stores';
import BackArrowSVG from '@public/BackIcon.svg';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

interface Props {
  streamerName: string;
  streamerProfileImage: string;
  isStreamer: boolean;
  onClickBack: () => void;
  onLeaveSession: () => void;
  onSwitchCamera: MouseEventHandler<HTMLButtonElement>;
}

export default function LiveHeader({
  streamerName,
  streamerProfileImage,
  isStreamer,
  onClickBack,
  onLeaveSession,
  onSwitchCamera,
}: Props) {
  // const isStreamer = useStore((state) => state.isStreamer);

  return (
    <header
      style={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,

        width: '100%',
        height: '60px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          flexGrow: '1',

          padding: '0 24px',

          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {!isStreamer && (
          <div>
            <Image
              src={streamerProfileImage}
              alt={streamerName}
              width={40}
              height={40}
            />
          </div>
        )}
        {isStreamer && (
          <>
            <button type="button" onClick={onClickBack}>
              <BackArrowSVG />
            </button>
            <button type="button" onClick={onLeaveSession}>
              방송 종료
            </button>
            <button type="button" onClick={onSwitchCamera}>
              카메라 변경
            </button>
          </>
        )}
      </div>
    </header>
  );
}
