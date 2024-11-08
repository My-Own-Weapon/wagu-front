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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */

'use client';

import React, {
  useEffect,
  useState,
  useRef,
  MouseEventHandler,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';

import Link from 'next/link';
import Image from 'next/image';

import { Store, VotableCards, VotedStoreCards } from '@/components/StoreCard';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';
import { StoreResponse } from '@/types';
import StorePosts from '@/app/map/_components/StorePosts';
import Heading from '@/components/ui/Heading';
import { NextImageWithCover } from '@/components/ui';
import { KingSVG } from '@public/newDesign/vote';
import { usePostsOfStore, useSelectedStore, useVotedStore } from '@/stores';
import { OnLiveFollowings } from '@/components/domain';
import { useFetchUserProfile } from '@/feature/auth/applications/hooks';

import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

interface UserProfile {
  imageUrl: string;
  username: string;
  name: string;
  isVoted: boolean;
}
interface UserLocation {
  userId: string;
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

interface UsersProfile {
  [key: string]: UserProfile;
}

const UserIconWithText = WithText<UserIconProps>(UserIcon);

export default function SharePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  const firstRender = useRef(true);

  /* kakao map */
  const [markers, setMarkers] = useState<any[]>([]);
  const kakaoMapRef = useRef<any>(null);

  const userMarkers = useRef<Map<string, any>>(new Map());
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);

  /* openvidu */
  const OV = useRef<OpenVidu | null>(null);
  const OVSession = useRef<Session | null>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  /* zustand */
  const { selectedStore, setSelectedStore } = useSelectedStore();
  const { votedStores, setVotedStores } = useVotedStore();
  const { postsOfStore, setPostsOfStore } = usePostsOfStore();

  /* local state */
  const [selectedStoreId, setSelectedStoreId] = useState<any>();
  const [usersProfile, setUsersProfile] = useState(new Map());
  const [isVoteStart, setIsVoteStart] = useState<boolean>(false);
  const [isVoteEnd, setIsVoteEnd] = useState<boolean>(false);
  const [voteEndCnt, setVoteEndCnt] = useState<number>(0);
  const [voteWinStores, setVoteWinStores] = useState<VoteStoreInfo[]>([]);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [streamerFromStores, setStreamerFromStores] = useState<any[]>([]);
  const [subscribersCount, setSubscribersCount] = useState<number>(1);

  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [connectionPeopleCount, setConnectionPeopleCount] = useState<number>(1);

  useEffect(() => {
    const joinSessionAndKakaoMap = async (sessionId: string) => {
      await makeKakaoMap();
      await joinSession(sessionId);

      window.kakao.maps.event.addListener(
        kakaoMapRef.current,
        'center_changed',
        updateCenterLocation,
      );
    };

    joinSessionAndKakaoMap(sessionId);

    fetchcurrUserProfile();

    window.addEventListener('beforeunload', leaveSession);

    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, [sessionId]);

  useEffect(() => {
    if (voteEndCnt === subscribers.length + 1) {
      voteAllDone();
    }
  }, [voteEndCnt]);

  const joinSession = async (sessionId: string) => {
    console.log('joinSession()');
    const openVidu = new OpenVidu();
    OV.current = openVidu;
    const ovSession = openVidu.initSession();
    OVSession.current = ovSession;

    ovSession.on('streamCreated', (event: any) => {
      const fetchSubscribersCount = async () => {
        const count = await apiService.fetchConnectionPeopleCount(sessionId);

        setConnectionPeopleCount(() => count);
      };

      // fetchSubscribersCount();

      const { clientData } = JSON.parse(event.stream.connection.data);
      const userName = localStorageApi.getUserName();
      if (clientData === userName) return;

      const subscriber = ovSession.subscribe(event.stream, undefined);

      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    ovSession.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);

      setUserLocations((prevLocations) => [...prevLocations, userLocation]);
      updateUserMarker(userLocation);
    });

    ovSession.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) => {
        return prevSubscribers.filter(
          (sub) => sub !== event.stream.streamManager,
        );
      });
    });

    // 나 투표했으니까 다들 투표된거 업데이트해
    ovSession.on('signal:voteUpdate', async (e: any) => {
      e.preventDefault();

      const voteList = await apiService.fetchStoresInVoteList(sessionId);
      setVotedStores([...voteList]);
    });

    ovSession.on('signal:voteStart', (e: any) => {
      e.preventDefault();

      setIsVoteStart(true);
    });

    ovSession.on('signal:voteDone', (e: any) => {
      e.preventDefault();
      const { userName } = JSON.parse(e.data);

      setUsersProfile((prev) => {
        const updated = new Map(prev.entries());
        const user = updated.get(userName);
        if (user) {
          updated.set(userName, { ...user, isVoted: true });
        }
        return updated;
      });
      setVoteEndCnt((voteCount) => voteCount + 1);
    });

    ovSession.on('signal:userData', async (e: any) => {
      const userDetail = JSON.parse(e.data);

      usersProfile.set(userDetail.username, userDetail);
      setUsersProfile((prev) => {
        const updated = new Map(prev.entries());
        updated.set(userDetail.username, userDetail);
        return updated;
      });
    });

    try {
      const token = await apiService.fetchShareMapToken(sessionId);
      if (!token) throw new Error('토큰이 정의되지 않았습니다');

      const username = localStorageApi.getUserName();
      await ovSession.connect(token, { clientData: username });
      const publisher = openVidu.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: false,
      });
      ovSession.publish(publisher);
    } catch (error) {
      console.error('세션 연결 중 오류 발생:', (error as Error).message);
    }
  };

  const fetchcurrUserProfile = async () => {
    const userName = localStorageApi.getUserName() as string;
    const profile = await apiService.fetchProfileWithoutFollow(userName);
    const { imageUrl, username, name } = profile;

    localStorageApi.setName(name);
    setMyProfile({ imageUrl, username, name, isVoted: false });
    setUsersProfile((prev) => {
      const updated = new Map(prev.entries());
      updated.set(username, { imageUrl, username, name, isVoteEnd: false });
      return updated;
    });
  };

  const makeKakaoMap = async () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (!container) {
            console.error('지도 컨테이너를 찾을 수 없습니다.');
            return;
          }

          const options = {
            center: new window.kakao.maps.LatLng(
              37.5035685391056,
              127.0416472341673,
            ),
            level: 5,
          };

          const mapInstance = new window.kakao.maps.Map(container, options);
          kakaoMapRef.current = mapInstance;

          // 맵이 로드되고 움직임이 있어야 본인의 프로필이 보이기 때문
          setTimeout(() => {
            mapInstance.panTo(
              new window.kakao.maps.LatLng(37.5035585179056, 127.04164711416),
            );

            setTimeout(() => {
              mapInstance.panTo(
                new window.kakao.maps.LatLng(
                  37.5035685391056,
                  127.0416472341673,
                ),
              );
            }, 300);
          }, 500);

          window.kakao.maps.event.addListener(mapInstance, 'idle', () => {
            const mapBounds = mapInstance.getBounds();
            const swLatLng = mapBounds.getSouthWest();
            const neLatLng = mapBounds.getNorthEast();

            fetchStoresData(mapInstance, {
              left: swLatLng.getLng(),
              down: swLatLng.getLat(),
              right: neLatLng.getLng(),
              up: neLatLng.getLat(),
            });
          });
        });

        resolve(null);
      };

      script.onerror = () => {
        console.error('카카오 지도 스크립트를 불러오지 못했습니다.');
        reject();
      };
    });
  };

  /* 좌표를 맵에 추가하는 함수 */
  const addMarkers = (mapInstance: any, storeData: StoreResponse[]) => {
    removeMarkers();

    const newMarkers = storeData.map((store) => {
      const { kakao } = window;
      const { liveStore } = store;
      const imageSrc = liveStore
        ? '/newDesign/map/pin_book_live.svg'
        : '/newDesign/map/pin_book.svg';
      const imageSize = new kakao.maps.Size(32, 32);
      const imageOption = { offset: new kakao.maps.Point(16, 32) };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      const markerPosition = new kakao.maps.LatLng(store.posy, store.posx);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        key: store.storeId,
        image: markerImage,
      });

      marker.setMap(mapInstance);

      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStoreId(store.storeId);
        fetchPostsAndSet(store.storeId);
        setSelectedStore(store);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const fetchStoresData = async (
    mapInstance: any,
    bounds: { left: number; down: number; right: number; up: number },
  ) => {
    try {
      const stores = await apiService.fetchMapBoundaryStores(bounds);

      addMarkers(mapInstance, stores);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  const fetchPostsAndSet = async (storeId: number) => {
    try {
      const posts = await apiService.fetchStorePosts(storeId);

      setPostsOfStore(posts);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  /* 투표 결과를 받아온다 */
  const fetchVoteResults = async () => {
    // if (!sessionId) {
    //   throw new Error('세션 ID가 없습니다.');
    // }

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
  const handleAddStoreToVoteListClick = async (
    url: string,
    storeId: number,
  ) => {
    // if (!sessionId) throw new Error(MSG.NO_SESSION_ID);

    try {
      const selectedStoreDetails = await apiService.fetchStoreDetails(storeId);
      const succMsg = await apiService.addStoreToVoteList(sessionId, storeId);
      const voteList = await apiService.fetchStoresInVoteList(sessionId);
      setVotedStores([...voteList]);

      alert(succMsg);
      broadcastUpdateVoteListSIG();
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

  // [BEFORE 투표] 투표가 ⛔️시작되기전⛔️에 가게 카드에서 투표버튼 ⭐️ 핸들러
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
      setVotedStores(
        votedStores.filter(
          ({ storeId: curStoreId }) => curStoreId != Number(storeId),
        ),
      );
      broadcastUpdateVoteListSIG();
      alert(succMsg);
    } catch (e) {
      if (e instanceof Error) {
        alert(`[${e.message}]
          이미 추가된 가게입니다 !`);
      }
    }
  };

  // [AFTER 투표] 투표 추가 버튼색이 빨강으로 변하면서 등록되는 함수
  const handleCancelVote: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();

    const { dataset } = e.currentTarget;
    const { storeId } = dataset;

    if (!sessionId || !storeId) {
      throw new Error('세션 ID 또는 store id가 없습니다.');
    }

    try {
      const succMsg = await apiService.cancelVoteStore(sessionId, storeId);

      alert(`${succMsg}`);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  // 내가 투표를 종료했을을 알리는 SIG
  const broadcastImVoteDoneSIG = () => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);
    if (OVSession.current) {
      const userName = localStorageApi.getUserName();

      OVSession.current.signal({
        data: JSON.stringify({ userName }),
        to: [],
        type: 'voteDone',
      });
    }
  };

  // voteUpdate 시그널을 받으면 누군가가 투표를 삭제하던 추가하던 voteList가 바뀌었으니 새로 받아와라 !
  const broadcastUpdateVoteListSIG = () => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (OVSession.current) {
      OVSession.current.signal({
        to: [],
        type: 'voteUpdate',
      });
    }
  };

  // 나 투표 하고싶어
  // ✅ TODO: 아무나 눌러도 다 시작됨
  const broadcastWantVoteStartSIG = () => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (OVSession.current) {
      OVSession.current.signal({
        to: [],
        type: 'voteStart',
      });
    }
  };

  const handleMyVoteDoneClick = () => {
    broadcastImVoteDoneSIG();
    setDisableButton(true);
  };

  const voteAllDone = async () => {
    await fetchVoteResults();
    setIsVoteEnd(true);
    setIsVoteStart(false);
  };

  const leaveSession = async () => {
    if (OVSession.current) {
      OVSession.current.disconnect();
    }
    setVoteEndCnt((prev) => prev + 1);
    if (publisher) {
      const mediaStream = publisher.stream.getMediaStream();
      if (mediaStream && mediaStream.getTracks) {
        mediaStream
          .getTracks()
          .forEach((track: { stop: () => any }) => track.stop());
      }
    }

    OVSession.current = null;
    setSubscribers(() => []);
    setPublisher(() => null);
  };

  const updateUserMarker = ({ userId: username, lat, lng }: UserLocation) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let overlay = userMarkers.current.get(username);
    const profileImg = usersProfile.get(username)?.imageUrl;
    const imageSrc = profileImg || '/profile/profile-default-icon-male.svg';
    const currentLevel = kakaoMapRef.current.getLevel();

    const content = document.createElement('div');
    content.style.width = '40px';
    content.style.height = '40px';
    content.style.overflow = 'hidden';
    content.style.borderRadius = '50%';
    content.style.border = '2px solid #ff9900';
    content.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    content.dataset.lat = String(lat);
    content.dataset.lng = String(lng);
    content.dataset.level = currentLevel;
    content.dataset.userName = localStorageApi.getUserName()!;
    content.ondragstart = () => false;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.dataset.lat = String(lat);
    img.dataset.lng = String(lng);
    img.dataset.level = currentLevel;
    img.dataset.userName = localStorageApi.getUserName()!;
    img.ondragstart = () => false;

    content.appendChild(img);

    img.onclick = (e) => {
      const target = e.target as HTMLImageElement;
      const { lat, lng, level } = target.dataset;
      const movePosition = new window.kakao.maps.LatLng(lat, lng);

      // map.setLevel(level, {
      //   anchor: movePosition,
      //   animate: { duration: 1000 },
      // });
      // map.setCenter(movePostion);
      // map.setLevel(level);
      // map.setLevel(4, {
      //   anchor: movePosition,
      //   animate: { duration: 1000 },
      // });
      // const movePosition = new window.kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.panTo(movePosition);
    };

    if (overlay) {
      overlay.setPosition(markerPosition);
    } else {
      overlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content,
        yAnchor: 1,
        zIndex: 10,
      });
      overlay.setMap(kakaoMapRef.current);
      userMarkers.current.set(username, overlay);
    }
  };

  // 내 프로필을 SIG으로 subscriber에게 보냄
  const sendUserData = ({ imageUrl, username, name }: UserProfile) => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (OVSession.current) {
      console.log('세션있음');
      OVSession.current.signal({
        data: JSON.stringify({ imageUrl, username, name }),
        to: [],
        type: 'userData',
      });
    } else {
      console.log('세션없음');
    }
  };

  // 내 위치를 SIG으로 subscriber에게 보냄
  const sendLocation = (lat: number, lng: number) => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);
    const username = localStorageApi.getUserName();

    if (OVSession.current) {
      OVSession.current.signal({
        // ✅ 이전코드임
        // data: JSON.stringify({ userId: username, lat, lng, userDetails }),
        data: JSON.stringify({ userId: username, lat, lng }),
        to: [],
        type: 'userLocation',
      });
    } else {
      console.error('세션 없음');
    }
  };

  /* 투표화면으로 들어갔을때 실행되지 않도록
     ✅ TODO: isVoteDone 일때도 실행되지 않아야한다. */
  const updateCenterLocation = () => {
    if (!markers || isVoteStart) return;

    const center = kakaoMapRef.current.getCenter();

    sendLocation(center.getLat(), center.getLng());
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const fetchLiveStores = async () => {
      const liveStoresUpdates = await Promise.all(
        voteWinStores.map(({ storeId }) => {
          return apiService.fetchOnLiveFollowingsAtStore(storeId);
        }),
      );
      const flattedLiveStoresUpdates = liveStoresUpdates.flat();

      setStreamerFromStores((prev) => [...prev, ...flattedLiveStoresUpdates]);
    };

    fetchLiveStores();
  }, [voteWinStores]);

  useEffect(() => {
    if (!selectedStoreId) return;

    const fetchLiveStores = async (selectedStoreId: number) => {
      const streamers =
        await apiService.fetchOnLiveFollowingsAtStore(selectedStoreId);

      setStreamerFromStores(() => streamers);
    };

    fetchLiveStores(selectedStoreId);
  }, [selectedStoreId]);

  // [ing 투표]
  if (isVoteStart) {
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
            <VotableCards
              stores={votedStores}
              handleAddVote={handleVoteStoreClick}
              handleDeleteVote={handleCancelVote}
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
              {voteWinStores.map(
                ({ storeId, storeName, menuImage, postCount, menuName }) => {
                  return (
                    <WinStoreCard
                      key={storeId}
                      storeId={storeId}
                      storeName={storeName}
                      menuImage={menuImage}
                      menuName={menuName}
                      postCount={postCount}
                    />
                  );
                },
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    /* [before 개표] 투표에 추가 첫화면 */
    return (
      <div className={s.addVoteContainer}>
        <div className={s.top}>
          <div id="map" className={s.map} />
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
          {selectedStore?.liveStore && selectedStore?.storeName && (
            <>
              <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
                {`${selectedStore.storeName}에서 방송중이에요 !`}
              </Heading>
              <OnLiveFollowings onLiveFollowings={streamerFromStores} />
            </>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <StorePosts
              selectedStoreName={selectedStore?.storeName || ''}
              selectedStoreId={selectedStore?.storeId || 0}
            />
          </Suspense>
          {/* )} */}
          <div className={s.navUpperBtnContainer}>
            <button
              className={s.addVoteListBtn}
              type="button"
              onClick={() => {
                if (!sessionId) return;
                handleAddStoreToVoteListClick(sessionId, selectedStoreId);
              }}
            >
              투표 추가
            </button>
            <button
              className={s.startVoteBtn}
              type="button"
              onClick={() => {
                setIsVoteStart(true);
                broadcastWantVoteStartSIG();
              }}
            >
              개표 신청
            </button>
          </div>
          {/* </div> */}
          {votedStores.length > 0 && (
            <div className={s.votedStoresWrapper}>
              <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
                투표에 추가된 STORE
              </Heading>
              <VotedStoreCards
                stores={votedStores}
                handleRemoveVotedStore={deleteStoreFromVoteList}
              />
              {/* <div className={s.voteListContainer}>
                {votedStores.map((store) => {
                  return (
                    <VotedStoreCard
                      key={store.storeId}
                      {...store}
                      nobutton
                      handleAddVote={handleVoteStoreClick}
                      handleDeleteVote={handleCancelVote}
                    />
                  );
                })}
              </div> */}
            </div>
          )}
          {subscribers.map((subscriber, index) => (
            <video
              style={{ display: 'none' }}
              key={index}
              id={`subscriberVideo${index}`}
              autoPlay
              ref={(video) => {
                if (video) {
                  video.srcObject = subscriber.stream.getMediaStream();
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

function WinStoreCard({
  storeId,
  storeName,
  menuImage,
  postCount,
  menuName,
}: Store) {
  const { url } = menuImage;

  return (
    <Link className={s.winStoreCardAnchor} href={`/store/${storeId}`}>
      <div className={s.winStoreCardContainer}>
        <NextImageWithCover
          src={url}
          id={String(storeId)}
          alt="vote-win-store-img"
          height="280px"
          borderRadius="24px"
        />
        <div className={s.titleArea}>
          <p className={s.storeName}>{storeName}</p>
          <p className={s.menuName}>{menuName}</p>
        </div>
      </div>
    </Link>
  );
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
