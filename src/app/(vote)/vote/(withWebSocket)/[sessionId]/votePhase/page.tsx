'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import {
  ConnectedUser,
  parseMessage,
  ServerProtocolMessageType,
} from '@/feature/webSocket/applications/hooks/useWebSocket';
import UserIcon from '@/components/ui/UserIcon/UserIcon';

import { useVoteWebSocketContext } from '@/feature/webSocket/context/voteWebSocketContext';
import { useSessionIdContext } from '@/feature/webRTC/context';
import { VotableStoreCards } from '@/components/feature/vote';

import s from './page.module.scss';

enum WebSocketPayloadType {
  SOMEONE_VOTE_DONE = 'someone_vote_done',
}

export default function VotePhase() {
  const router = useRouter();
  const sessionId = useSessionIdContext();
  const { ws, sendMessage, connectedUsers, setConnectedUsers, disconnect } =
    useVoteWebSocketContext();

  const webSocketHandlers = useMemo(
    () => ({
      [WebSocketPayloadType.SOMEONE_VOTE_DONE]: (userName: string) => {
        setConnectedUsers((users) => {
          const filtered = users.filter((user) => user.userName !== userName);
          const doneUser = users.find((user) => user.userName === userName);
          if (!doneUser) return users;

          return [...filtered, { ...doneUser, isVoteDone: true }];
        });
      },
    }),
    [setConnectedUsers],
  );

  useEffect(() => {
    if (!ws) return undefined;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = parseMessage(event.data);
      const { type, data } = message;

      if (type !== ServerProtocolMessageType.CHAT) return;

      const { type: payloadType, senderUserName } = data;
      if (!webSocketHandlers[payloadType as WebSocketPayloadType]) return;

      switch (payloadType) {
        case WebSocketPayloadType.SOMEONE_VOTE_DONE:
          webSocketHandlers[payloadType](senderUserName);
          break;
        default:
          break;
      }
    };

    ws.addEventListener('message', handleWebSocketMessage);

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
      disconnect();
    };
  }, [ws]);

  useEffect(() => {
    if (
      !!ws &&
      connectedUsers.length > 0 &&
      connectedUsers.every((user) => user.isVoteDone)
    ) {
      router.push(`/vote/resultPhase/${sessionId}`);
    }
  }, [connectedUsers, router, sessionId, ws]);

  return (
    <div className={s.startVoteContainer}>
      <div className={s.userContainer}>
        <UserIcons connectedUsers={connectedUsers} />
      </div>
      <div className={s.startVoteWrapper}>
        <Suspense fallback={<div>Loading...</div>}>
          <VotableStoreCards sessionId={sessionId} />
        </Suspense>
        <div className={s.navUpperBtnContainer}>
          <button
            className={s.myVoteDoneBtn}
            type="button"
            onClick={() => {
              sendMessage?.(WebSocketPayloadType.SOMEONE_VOTE_DONE, {});
            }}
            // ✅ TODO: 주석을 해제해야합니다.
            // disabled={disable}
          >
            나의 투표 종료
          </button>
        </div>
      </div>
    </div>
  );
}

function UserIcons({ connectedUsers }: { connectedUsers: ConnectedUser[] }) {
  return (
    <div className={s.userContainer}>
      {connectedUsers.map(({ userName, userProfileImageUrl, isVoteDone }) => {
        return (
          <UserIcon.Root key={userName} size="large" shape="circle">
            {isVoteDone && <UserIcon.Textballoon />}
            <UserIcon.Image imgSrc={userProfileImageUrl} alt="profile-icon" />
            <UserIcon.Text color="black">{userName}</UserIcon.Text>
          </UserIcon.Root>
        );
      })}
    </div>
  );
}
