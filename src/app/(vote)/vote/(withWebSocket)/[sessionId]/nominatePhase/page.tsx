/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
  useAddCandidateStore,
  useJoinVoiceCall,
} from '@/feature/vote/applications/hooks';
import { useSelectedStore } from '@/stores';
import { useBoundaryStores, useKakaoMap } from '@/hooks/domains';

import { BoxButton, Heading, Spacing, Stack } from '@/components/ui';
import { OnLiveFollowingsAtStore } from '@/components/feature';
import StorePosts from '@/app/map/_components/StorePosts';
import { CandidateStores } from '@/app/(vote)/vote/_components';
import { VoiceCallStreams } from '@/components/feature/vote';
import { useSessionIdContext } from '@/feature/webRTC/context';

import { useVoteWebSocketContext } from '@/feature/webSocket/context/voteWebSocketContext';
import {
  ConnectedUser,
  parseMessage,
  ServerProtocolMessageType,
} from '@/feature/webSocket/applications/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { StoreResponse } from '@/types';
import { localStorageApi } from '@/services/localStorageApi';
import { useDebounce } from '@/lib/hooks';
import UserIcon from '@/components/ui/UserIcon/UserIcon';

import s from './page.module.scss';

enum WebSocketPayloadType {
  SOMEONE_NOMINATE_DONE = 'someone_nominate_done',
  NOMINATE_CANDIDATE = 'nominate_candidate',
  CHANGE_USER_LOCATION = 'change_user_location',
}

type Overlay = any;

declare global {
  interface Window {
    kakao: any;
  }
}

function NominatePhase() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionId = useSessionIdContext();
  const { ws, sendMessage, connectedUsers, setConnectedUsers } =
    useVoteWebSocketContext();
  const { subscribers } = useJoinVoiceCall(sessionId);

  /* kakao map */
  const userMarkers = useRef<Map<string, Overlay>>(new Map());

  const { addCandidateStore } = useAddCandidateStore({ sessionId });

  /* zustand 다른 페이지로 이동 후 돌아왔을때 저장을 위해 */
  const { selectedStore, setSelectedStore } = useSelectedStore();

  /* kakao map */
  const { stores, setBoundary } = useBoundaryStores();
  const { onLoadMapRef, createMarkers, mapModelRef, createCustomImageMarker } =
    useKakaoMap(setBoundary);

  const updateUserMarker = useCallback(
    ({
      userName,
      lat,
      lng,
    }: {
      userName: string;
      lat: number;
      lng: number;
    }) => {
      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      let overlay = userMarkers.current?.get(userName);

      if (overlay) {
        const currentPos = overlay.getPosition();
        const targetPos = markerPosition;

        moveMarkerSmooth(overlay, currentPos, targetPos);
      } else {
        const profileImageUrl = localStorageApi.getUserProfileImageUrl();
        const imageSrc =
          profileImageUrl || '/profile/profile-default-icon-male.svg';
        const userMarker = createCustomImageMarker(imageSrc, lat, lng);

        overlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: userMarker,
          yAnchor: 1,
          zIndex: 10,
        });
        overlay.setMap(mapModelRef.current?.kakaoMapInstance);
        userMarkers.current?.set(userName, overlay);
      }
    },
    [createCustomImageMarker, mapModelRef],
  );

  const webSocketHandlers = useMemo(
    () => ({
      [WebSocketPayloadType.SOMEONE_NOMINATE_DONE]: (userName: string) => {
        setConnectedUsers((users) => {
          const filtered = users.filter((user) => user.userName !== userName);
          const doneUser = users.find((user) => user.userName === userName);
          if (!doneUser) return users;

          return [...filtered, { ...doneUser, isNomiateDone: true }];
        });
      },

      [WebSocketPayloadType.NOMINATE_CANDIDATE]: () => {
        queryClient.invalidateQueries({
          queryKey: ['fetchCandidateStores', sessionId],
        });
      },

      [WebSocketPayloadType.CHANGE_USER_LOCATION]: ({
        userName,
        lat,
        lng,
      }: {
        userName: string;
        lat: number;
        lng: number;
      }) => {
        updateUserMarker({ userName, lat, lng });
      },
    }),
    [queryClient, sessionId, setConnectedUsers, updateUserMarker],
  );

  useEffect(() => {
    if (!ws) return undefined;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = parseMessage(event.data);
      const { type, data } = message;

      if (type !== ServerProtocolMessageType.CHAT) return;

      const { type: payloadType, senderUserName, payload } = data;
      if (!webSocketHandlers[payloadType as WebSocketPayloadType]) return;

      switch (payloadType) {
        case WebSocketPayloadType.SOMEONE_NOMINATE_DONE:
          webSocketHandlers[payloadType](senderUserName);
          break;

        case WebSocketPayloadType.NOMINATE_CANDIDATE:
          webSocketHandlers[payloadType]();
          break;

        case WebSocketPayloadType.CHANGE_USER_LOCATION: {
          const { lat, lng } = payload as { lat: number; lng: number };

          webSocketHandlers[payloadType]({
            userName: senderUserName,
            lat,
            lng,
          });
          break;
        }
        default:
          break;
      }
    };

    ws.addEventListener('message', handleWebSocketMessage);

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
    };
  }, [ws]);

  const sendLocation = () => {
    const userName = localStorageApi.getUserName();
    const center = mapModelRef.current?.kakaoMapInstance?.getCenter();
    const [lat, lng] = [center.getLat(), center.getLng()];

    sendMessage?.(WebSocketPayloadType.CHANGE_USER_LOCATION, {
      userName,
      lat,
      lng,
    });
  };

  const debouncedSendLocation = useDebounce(sendLocation, 500);
  useEffect(() => {
    if (ws && mapModelRef.current?.kakaoMapInstance) {
      window.kakao.maps.event.addListener(
        mapModelRef.current?.kakaoMapInstance,
        'center_changed',
        debouncedSendLocation,
      );
    }
  }, [ws, mapModelRef.current?.kakaoMapInstance]);

  useEffect(() => {
    if (
      !!ws &&
      connectedUsers.length > 0 &&
      connectedUsers.every((user) => user.isNomiateDone)
    ) {
      router.push(`/vote/${sessionId}/votePhase`);
    }
  }, [connectedUsers, router, sessionId, ws]);

  useEffect(() => {
    const handleClickMarker = (store: StoreResponse) => {
      setSelectedStore(store);
    };

    createMarkers(stores, handleClickMarker);
  }, [stores, setSelectedStore, createMarkers]);

  return (
    <div className={s.addVoteContainer}>
      <div className={s.top}>
        <div id="map" className={s.map} ref={onLoadMapRef} />
        <UserIcons connectedUsers={connectedUsers} />
      </div>
      <div className={s.bottom}>
        <SelectedStoreSection selectedStore={selectedStore} />
        <div className={s.navUpperBtnContainer}>
          <BoxButton
            styleType="outline"
            height="48px"
            onClick={() => {
              if (!selectedStore) return;

              addCandidateStore({
                storeId: selectedStore.storeId,
                onSuccess: () => {
                  if (sendMessage) {
                    sendMessage(WebSocketPayloadType.NOMINATE_CANDIDATE, null);
                  }
                },
              });
            }}
            disabled={!selectedStore}
          >
            투표 추가
          </BoxButton>
          <BoxButton
            styleType="fill"
            height="48px"
            onClick={() => {
              if (sendMessage) {
                sendMessage(WebSocketPayloadType.SOMEONE_NOMINATE_DONE, {});
              }
            }}
          >
            개표 신청
          </BoxButton>
        </div>
        <Stack>
          <Spacing size={24} />
          <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
            투표에 추가된 STORE
          </Heading>
          <Spacing size={8} />
          <CandidateStores sessionId={sessionId} />
        </Stack>
      </div>
      <VoiceCallStreams subscribers={subscribers} />
    </div>
  );
}

/**
 * 마커를 부드럽게 이동시키는 함수
 *
 * @param overlay - 이동시킬 마커 (window.kakao.maps.CustomOverlay)
 * @param start - 시작 위치 (window.kakao.maps.LatLng)
 * @param end - 목표 위치 (window.kakao.maps.LatLng)
 * @param duration - 이동 시간 (ms)
 */
const moveMarkerSmooth = (
  overlay: Overlay,
  start: {
    getLat: () => number;
    getLng: () => number;
  },
  end: {
    getLat: () => number;
    getLng: () => number;
  },
  duration: number = 300,
) => {
  const startTime = performance.now();
  const startLat = start.getLat() as number;
  const startLng = start.getLng() as number;
  const endLat = end.getLat() as number;
  const endLng = end.getLng() as number;

  /**
   * 현재의 코드 -> easeOutCubic: 끝으로 갈수록 속도가 천천히 감소됨
   *
   * 1. Linear (이징 없음)
   * ```
   * const linear = progress;
   * ```
   *
   * 2. Ease-in (점점 빨라짐)
   * ```
   * const easeIn = Math.pow(progress, 3);
   * ```
   *
   * 3. Ease-out (점점 느려짐)
   * ```
   * const easeOut = 1 - Math.pow(1 - progress, 3);
   * ```
   *
   * 4. Ease-in-out (시작과 끝에서 천천히)
   * ```
   * const easeInOut = progress < 0.5
   *   ? 4 * Math.pow(progress, 3)
   *   : 1 - Math.pow(-2 * progress + 2, 3) / 2;
   * ```
   */
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress = 1 - (1 - progress) ** 3;

    const currentLat = startLat + (endLat - startLat) * easeProgress;
    const currentLng = startLng + (endLng - startLng) * easeProgress;

    const newPosition = new window.kakao.maps.LatLng(currentLat, currentLng);
    overlay.setPosition(newPosition);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

function UserIcons({ connectedUsers }: { connectedUsers: ConnectedUser[] }) {
  return (
    <div className={s.userContainer}>
      {connectedUsers.map(
        ({ userName, userProfileImageUrl, isNomiateDone }) => {
          return (
            <UserIcon.Root key={userName} size="large" shape="circle">
              {isNomiateDone && <UserIcon.Textballoon />}
              <UserIcon.Image imgSrc={userProfileImageUrl} alt="profile-icon" />
              <UserIcon.Text color="black">{userName}</UserIcon.Text>
            </UserIcon.Root>
          );
        },
      )}
    </div>
  );
}

function SelectedStoreSection({
  selectedStore = undefined,
}: {
  selectedStore?: StoreResponse;
}) {
  return !selectedStore ? (
    <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
      지도의 가게를 클릭해보세요 !
    </Heading>
  ) : (
    <>
      {selectedStore.liveStore && (
        <>
          <Suspense fallback={<div>로딩중...</div>}>
            <OnLiveFollowingsAtStore
              storeId={selectedStore.storeId}
              storeName={selectedStore.storeName}
            />
          </Suspense>
          <Spacing size={24} />
        </>
      )}
      <Suspense fallback={<div>로딩중...</div>}>
        <StorePosts
          selectedStoreName={selectedStore.storeName}
          selectedStoreId={selectedStore.storeId}
        />
      </Suspense>
    </>
  );
}

export default NominatePhase;
