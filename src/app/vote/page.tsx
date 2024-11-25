/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-depth */
/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */

'use client';

import React, {
  useEffect,
  useState,
  useRef,
  MouseEventHandler,
  Suspense,
  useMemo,
} from 'react';
import { useSearchParams } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

import { VotableStoreCards } from '@/components/StoreCard';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';
import { StoreResponse } from '@/types';
import StorePosts from '@/app/map/_components/StorePosts';
import { BoxButton, Spacing, Stack, Heading } from '@/components/ui';
import { KingSVG } from '@public/newDesign/vote';
import { useSelectedStore, useVotedStore } from '@/stores';
import { OnLiveFollowingsAtStore } from '@/components/domain';
import { useWebSocket } from '@/app/vote/_hook/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';

import { useBoundaryStores, useKakaoMap } from '@/hooks/domains';
import { createElementWithAttr, elementsAppendChild } from '@/utils';
import { CandidateStores, WinnerStoreCards } from '@/app/vote/_components';

import useJoinVoiceCall from '@/feature/vote/applications/hooks/useJoinVoiceCall';
import { VoiceCallStreams } from '@/components/domain/vote';
import { useDebounce } from '@/lib/hooks';

import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

interface UserLocation {
  userName: string;
  lat: number;
  lng: number;
}

export interface VoteStoreInfo {
  storeId: number;
  storeName: string;
  menuName: string;
  menuImage: {
    id: number;
    url: string;
  };
  postCount: number;
}

const UserIconWithText = WithText<UserIconProps>(UserIcon);

export default function SharePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  if (!sessionId) throw new Error('sessionId is not defined');
  /* server state */
  // const { profileViewModel } = useGetUserProfile({
  //   userName: localStorageApi.getUserName() as string,
  // });

  // const { openVidu: ov, ovSession: session } = useContext(WebRTCContext);

  const queryClient = useQueryClient();

  /* kakao map */
  const userMarkers = useRef<Map<string, any>>(new Map());

  /* openvidu */
  const { subscribers } = useJoinVoiceCall({ sessionId });

  /* local state */
  const [selectedStoreId, setSelectedStoreId] = useState<number>();

  /* zustand 다른 페이지로 이동 후 돌아왔을때 저장을 위해 */
  const { selectedStore, setSelectedStore } = useSelectedStore();
  const { candidateStores, setCandidateStores } = useVotedStore();

  /* kakao map */
  const { stores, setBoundary } = useBoundaryStores();
  const { onLoadMapRef, createMarkers, mapModelRef } = useKakaoMap(setBoundary);

  useEffect(() => {
    const handleClickMarker = (store: StoreResponse) => {
      setSelectedStoreId(store.storeId);
      setSelectedStore(store);
    };

    createMarkers(stores, handleClickMarker);
  }, [stores, setSelectedStore, createMarkers]);

  /* local state */
  const [usersProfile, setUsersProfile] = useState(new Map());
  const [isVotePhase, setIsVotePhase] = useState<boolean>(false);
  const [isVoteEnd, setIsVoteEnd] = useState<boolean>(false);
  const [voteEndCnt, setVoteEndCnt] = useState<number>(0);
  const [voteWinStores, setVoteWinStores] = useState<VoteStoreInfo[]>([]);

  /* Web socket */
  const webSocketHandlers = useMemo(
    () => ({
      voteUpdate: async (sessionId: string) => {
        const candidateStores =
          await apiService.fetchStoresInVoteList(sessionId);
        setCandidateStores([...candidateStores]);
        queryClient.invalidateQueries({
          queryKey: ['fetchCandidateStores', sessionId],
        });
      },

      voteStart: () => {
        setIsVotePhase(true);
      },

      voteDone: (userName: string) => {
        setUsersProfile((prev) => {
          const updated = new Map(prev.entries());
          const user = updated.get(userName);
          if (user) {
            updated.set(userName, { ...user, isVoted: true });
          }
          return updated;
        });
        setVoteEndCnt((voteCount) => voteCount + 1);
      },

      userData: (userDetail: any) => {
        console.log('[sig]userData : ', userDetail);

        setUsersProfile((prev) => {
          const updated = new Map(prev.entries());
          updated.set(userDetail.username, userDetail);
          return updated;
        });
      },

      userLocation: ({
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
    [],
  );
  const webSocketConfig = useMemo(
    () => ({
      retry: false,
      retryInterval: 1000 * 60 * 30,
      maxRetries: 3,
      handlers: webSocketHandlers,
      sessionId,
    }),
    [sessionId],
  );
  const { sendMessage, status } = useWebSocket(webSocketConfig);

  const sendLocation = () => {
    const userName = localStorageApi.getUserName();
    const center = mapModelRef.current?.kakaoMapInstance?.getCenter();
    const [lat, lng] = [center.getLat(), center.getLng()];

    sendMessage('userLocation', { userName, lat, lng });
  };
  const debouncedSendLocation = useDebounce(sendLocation, 500);

  useEffect(() => {
    if (status === 'OPEN' && mapModelRef.current?.kakaoMapInstance) {
      window.kakao.maps.event.addListener(
        mapModelRef.current?.kakaoMapInstance,
        'center_changed',
        debouncedSendLocation,
      );
    }
  }, [status, mapModelRef.current?.kakaoMapInstance]);

  useEffect(() => {
    const fetchcurrUserProfile = async () => {
      const userName = localStorageApi.getUserName() as string;
      const profile = await apiService.fetchProfileWithoutFollow(userName);

      const { imageUrl, username, name } = profile;
      localStorageApi.setName(name);

      sendMessage('userData', { imageUrl, username, name, isVoted: false });
    };

    fetchcurrUserProfile();
  }, [subscribers]);

  useEffect(() => {
    if (voteEndCnt === subscribers.length + 1) {
      voteAllDone();
    }
  }, [voteEndCnt]);

  /* 투표 결과를 받아온다 */
  const fetchVoteResults = async () => {
    try {
      const result = await apiService.fetchVoteResults(sessionId);

      setVoteWinStores(() => result);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  // 투표 list에 추가하기 위한 함수
  const handleNominateCandidateStoreClick = async (
    url: string,
    storeId: number,
  ) => {
    // if (!sessionId) throw new Error(MSG.NO_SESSION_ID);

    try {
      const succMsg = await apiService.addStoreToVoteList(sessionId, storeId);
      const voteList = await apiService.fetchStoresInVoteList(sessionId);
      setCandidateStores([...voteList]);
      alert(succMsg);
      broadcastUpdateCandidateStores();
      queryClient.invalidateQueries({
        queryKey: ['fetchCandidateStores', sessionId],
      });
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  // [AFTER 투표] 투표가 시작되었을때 가게 카드에서 투표버튼 핸들러
  const handleVoteStoreClick: MouseEventHandler<HTMLButtonElement> = async (
    e,
  ) => {
    e.stopPropagation();

    const { dataset } = e.currentTarget as HTMLButtonElement;
    const { storeId } = dataset;

    if (!sessionId || !storeId) throw new Error('세션 ID가 없습니다.');

    try {
      const succMsg = await apiService.voteStore(sessionId, storeId);

      alert(succMsg);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  // [AFTER 투표] 투표가 시작되고 실제 투표하는 함수
  const deleteStoreFromVoteList: MouseEventHandler<HTMLButtonElement> = async (
    e,
  ) => {
    if (!sessionId) {
      alert('세션 ID 또는 store id가 없습니다.');
      return;
    }

    const { storeId } = e.currentTarget.dataset;

    if (!storeId) return;

    try {
      const succMsg = await apiService.deleteStoreFromVoteList(
        sessionId,
        storeId,
      );
      setCandidateStores(
        candidateStores.filter(
          ({ storeId: curStoreId }) => curStoreId != Number(storeId),
        ),
      );
      broadcastUpdateCandidateStores();
      alert(succMsg);
    } catch (e) {
      if (e instanceof Error) {
        alert(`[${e.message}]
          이미 추가된 가게입니다 !`);
      }
    }
  };

  // 내가 투표를 종료했을을 알리는 SIG
  const broadcastImVoteDoneSIG = () => {
    sendMessage('voteDone', {
      userName: localStorageApi.getUserName(),
    });
  };

  // voteUpdate 시그널을 받으면 누군가가 투표를 삭제하던 추가하던 voteList가 바뀌었으니 새로 받아와라 !
  const broadcastUpdateCandidateStores = () => {
    sendMessage('voteUpdate', null);
  };

  // 나 투표 하고싶어
  // ✅ TODO: 아무나 눌러도 다 시작됨
  const broadcastWantVoteStartSIG = () => {
    sendMessage('voteStart', null);
  };

  const handleMyVoteDoneClick = () => {
    broadcastImVoteDoneSIG();
  };

  const voteAllDone = async () => {
    await fetchVoteResults();
    setIsVoteEnd(true);
    setIsVotePhase(false);
  };

  const updateUserMarker = ({ userName, lat, lng }: UserLocation) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let overlay = userMarkers.current.get(userName);

    if (overlay) {
      const currentPos = overlay.getPosition();
      const targetPos = markerPosition;

      moveMarkerSmooth(overlay, currentPos, targetPos);
    } else {
      const profileImg = usersProfile.get(userName)?.imageUrl;
      const imageSrc = profileImg || '/profile/profile-default-icon-male.svg';
      const userMarker = createUserMarker(imageSrc, lat, lng);

      overlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: userMarker,
        yAnchor: 1,
        zIndex: 10,
      });
      overlay.setMap(mapModelRef.current?.kakaoMapInstance);
      userMarkers.current.set(userName, overlay);
    }
  };

  const createUserMarker = (imageSrc: string, lat: number, lng: number) => {
    const $userMarker = createElementWithAttr('div', {
      style: {
        width: '40px',
        height: '40px',
        overflow: 'hidden',
        borderRadius: '50%',
        border: '2px solid #ff9900',
        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease-out',
      },
    });
    $userMarker.addEventListener('click', () => {
      const movePosition = new window.kakao.maps.LatLng(lat, lng);
      mapModelRef.current?.kakaoMapInstance.panTo(movePosition);
    });

    const $userMarkerImg = createElementWithAttr('img', {
      src: imageSrc,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    });
    elementsAppendChild($userMarkerImg, $userMarker);

    return $userMarker;
  };

  // [isVotingPhase]
  if (isVotePhase) {
    return (
      <>
        <ShareHeader />
        <div className={s.startVoteContainer}>
          <div className={s.userContainer}>
            {[...usersProfile].map(
              ([username, { imageUrl, name, isVoted }]) => {
                return (
                  <div key={username} className={s.votingUsers}>
                    {isVoted && (
                      <Image
                        src="/newDesign/vote/vote_done.svg"
                        alt="vote-done"
                        width={54}
                        height={25}
                      />
                    )}
                    <UserIconWithText
                      shape="circle"
                      size="large"
                      fontSize="medium"
                      color="black"
                      imgSrc={
                        !!imageUrl
                          ? imageUrl
                          : '/profile/profile-default-icon-male.svg'
                      }
                      alt="profile-icon"
                    >
                      {name}
                    </UserIconWithText>
                  </div>
                );
              },
            )}
          </div>
          <div className={s.startVoteWrapper}>
            <VotableStoreCards
              stores={
                queryClient.getQueryData(['fetchCandidateStores', sessionId]) ??
                []
              }
              handleAddVote={handleVoteStoreClick}
              handleDeleteVote={deleteStoreFromVoteList}
            />
            <div className={s.navUpperBtnContainer}>
              <button
                className={s.myVoteDoneBtn}
                type="button"
                onClick={handleMyVoteDoneClick}
                // ✅ TODO: 주석을 해제해야합니다.
                // disabled={disable}
              >
                나의 투표 종료
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else if (isVoteEnd) {
    /* [end 개표] 결과 발표 */
    return (
      <>
        <ResultHeader />
        <div className={s.endVoteContainer}>
          <div className={s.top}>
            <div className={s.winningMsgArea}>
              <KingSVG />
              <Heading
                as="h3"
                color="white"
                fontSize="24px"
                fontWeight="medium"
              >
                {`${voteWinStores[0]?.storeName}이 우승했어요 !`}
              </Heading>
            </div>
          </div>
          <div className={s.bottom}>
            <div className={s.endVoteWrapper}>
              <WinnerStoreCards sessionId={sessionId} />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    /* [isNomination Phase] 투표에 추가 첫화면 */
    return (
      <div className={s.addVoteContainer}>
        <div className={s.top}>
          <div id="map" className={s.map} ref={onLoadMapRef} />
          <div className={s.userContainer}>
            {[...usersProfile].map(([username, { imageUrl, name }]) => {
              return (
                <UserIconWithText
                  key={username}
                  shape="circle"
                  size="small"
                  color="black"
                  imgSrc={
                    !!imageUrl
                      ? imageUrl
                      : '/profile/profile-default-icon-male.svg'
                  }
                  alt="profile-icon"
                >
                  {name}
                </UserIconWithText>
              );
            })}
          </div>
        </div>
        <div className={s.bottom}>
          {!selectedStore ? (
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
          )}
          <div className={s.navUpperBtnContainer}>
            <BoxButton
              styleType="outline"
              height="48px"
              onClick={() => {
                if (selectedStoreId) {
                  handleNominateCandidateStoreClick(sessionId, selectedStoreId);
                }
              }}
              disabled={!selectedStoreId}
            >
              투표 추가
            </BoxButton>
            <BoxButton
              styleType="fill"
              height="48px"
              onClick={() => {
                setIsVotePhase(true);
                broadcastWantVoteStartSIG();
              }}
            >
              개표 신청
            </BoxButton>
            <Link href="/vote/test">test</Link>
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
}

function ResultHeader() {
  return (
    <header className={s.resultHeaderContainer}>
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        <Link href="/search">
          <Image
            src="/newDesign/nav/search_glass.svg"
            alt="search-btn"
            width={24}
            height={24}
          />
        </Link>
        <Link href="/profile">
          <Image
            src="/newDesign/nav/user_profile.svg"
            alt="heart-btn"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </header>
  );
}

function ShareHeader() {
  return (
    <header className={s.sharePageHeaderContainer}>
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        <Link href="/search">
          <Image
            src="/newDesign/nav/search_glass_gray.svg"
            alt="search-btn"
            width={24}
            height={24}
          />
        </Link>
        <div className={s.profileContainer}>
          <Image
            className={s.profileIcon}
            src="/newDesign/nav/profile_gray.svg"
            alt="profile-btn"
            width={24}
            height={24}
          />
          <div className={s.dropdownMenu}>
            <Link className={s.myPage} href="/profile">
              마이페이지
            </Link>
            <div className={s.logout}>
              <button type="button" className={s.logoutBtn}>
                <p className={s.text}>로그아웃</p>
              </button>
              <Image
                src="/newDesign/sign_out.svg"
                alt="arrow-down"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
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
  overlay: any,
  start: any,
  end: any,
  duration: number = 300,
) => {
  const startTime = performance.now();
  const startLat = start.getLat();
  const startLng = start.getLng();
  const endLat = end.getLat();
  const endLng = end.getLng();

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
