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

import React, { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { useSearchParams } from 'next/navigation';
import { OpenVidu, Subscriber } from 'openvidu-browser';

import Link from 'next/link';
import Image from 'next/image';

import { Store, VotableCards, VotedStoreCards } from '@/components/StoreCard';
import LiveFriends from '@/components/LiveFriendsList';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';
import { StoreResponse } from '@/types';
import PostsOfMap from '@/app/map/_components/PostsOfMap';
import Heading from '@/components/ui/Heading';
import ImageFill from '@/components/ui/ImageFill';
import { KingSVG } from '@public/newDesign/vote';

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

const SEND_LOCATION_INTERVAL = 10000;
const MSG = {
  NO_SESSION_INSTANCE: 'session 인스턴스가 없습니다.',
  NO_SESSION_ID: 'session id가 없습니다.',
};

const UserIconWithText = WithText<UserIconProps>(UserIcon);

export default function SharePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  const firstRender = useRef(true);

  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);

  const userMarkers = useRef<Map<string, any>>(new Map());
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [usersProfile, setUsersProfile] = useState(new Map());
  //
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>();
  const [posts, setPosts] = useState<any[]>([]);
  //

  const [votedStores, setVotedStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<any>();
  const [postsOfStore, setPostsOfStore] = useState<any[]>([]);

  const [isVoteStart, setIsVoteStart] = useState<boolean>(false);
  const [isVoteEnd, setIsVoteEnd] = useState<boolean>(false);
  const [voteEndCnt, setVoteEndCnt] = useState<number>(0);
  const [voteWinStores, setVoteWinStores] = useState<VoteStoreInfo[]>([]);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [streamerFromStores, setStreamerFromStores] = useState<any[]>([]);

  useEffect(() => {
    console.log('--- subscriber 배열 :', subscribers);
    console.log('--- subscriber 배열 길이 :', subscribers.length);
  }, [subscribers]);

  useEffect(() => {
    console.log('usersProfile :', usersProfile);
  }, [usersProfile]);

  useEffect(() => {
    // 세션 생성 및 오디오 태그에 오디오 소스 연결
    // joinSessionAndPatchAudioTag(sessionId);
    const fetchcurrUserProfile = async () => {
      const userName = localStorageApi.getUserName() as string;
      const profile = await apiService.fetchProfileWithoutFollow(userName);

      console.log('apiService profile', profile);

      const { imageUrl, username, name } = profile;
      localStorageApi.setName(name);

      // sendUserData({ imageUrl, username, name });
      setUsersProfile((prev) => {
        const updated = new Map(prev.entries());
        updated.set(username, { imageUrl, username, name });
        return updated;
      });
    };

    fetchcurrUserProfile();

    // kakao map 생성
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
        setMap(mapInstance);

        // 맵이 로드되고 움직임이 있어야 본인의 프로필이 보이기 때문
        setTimeout(() => {
          mapInstance.panTo(
            new window.kakao.maps.LatLng(37.5035585179056, 127.04164711416),
          );

          setTimeout(() => {
            mapInstance.panTo(
              new window.kakao.maps.LatLng(37.5035685391056, 127.0416472341673),
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
    };

    script.onerror = () => {
      console.error('카카오 지도 스크립트를 불러오지 못했습니다.');
    };
  }, []);

  useEffect(() => {
    const fetchcurrUserProfile = async () => {
      const userName = localStorageApi.getUserName() as string;
      const profile = await apiService.fetchProfileWithoutFollow(userName);

      console.log('apiService profile', profile);

      const { imageUrl, username, name } = profile;
      localStorageApi.setName(name);

      sendUserData({ imageUrl, username, name });
    };

    fetchcurrUserProfile();
  }, [subscribers]);

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(
        map,
        'center_changed',
        updateCenterLocation,
      );

      if (sessionId) {
        joinSessionAndPatchAudioTag(sessionId);
      }
    }
  }, [map]);

  // session이 없을때 map의 이벤트를 등록하면 updateCenterLocation 내부의 시그널이 등록되지 않습니다.
  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(
        map,
        'center_changed',
        updateCenterLocation,
      );
    }
  }, [session]);

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);

    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, []);

  useEffect(() => {
    if (voteEndCnt == subscribers.length + 1) {
      voteAllDone();
    }
  }, [voteEndCnt]);

  const joinSession = async (sessionId: string) => {
    console.log('--- join session !!!');

    const OV = new OpenVidu();
    setOV(OV);
    const session = OV.initSession();
    setSession(session);

    session.on('streamCreated', (event: any) => {
      const { clientData } = JSON.parse(event.stream.connection.data);
      const userName = localStorageApi.getUserName();
      if (clientData === userName) return;

      //   let flag = false;

      //   [...usersProfile].forEach(([key, vale]) => {
      //     console.log('---- user name ', key, vale);
      //     if (key === clientData) {
      //       flag = true;
      //     }
      //   });

      //   if (flag) return;
      //   const subscriber = session.subscribe(event.stream, undefined);

      const subscriber = session.subscribe(event.stream, undefined);

      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);

      console.log('userLocation : ', userLocation);

      setUserLocations((prevLocations) => [...prevLocations, userLocation]);
      updateUserMarker(userLocation);
    });

    session.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) => {
        return prevSubscribers.filter(
          (sub) => sub !== event.stream.streamManager,
        );
      });
    });

    // 나 투표했으니까 다들 투표된거 업데이트해
    session.on('signal:voteUpdate', async (e: any) => {
      e.preventDefault();

      const voteList = await apiService.fetchStoresInVoteList(sessionId);
      setVotedStores([...voteList]);
    });

    session.on('signal:voteStart', (e: any) => {
      e.preventDefault();

      setIsVoteStart(true);
    });

    session.on('signal:voteDone', (e: any) => {
      e.preventDefault();

      setVoteEndCnt((voteCount) => voteCount + 1);
    });

    session.on('signal:userData', async (e: any) => {
      const userDetail = JSON.parse(e.data);
      console.log('signal userData', userDetail);
      usersProfile.set(userDetail.username, userDetail);

      setUsersProfile((prev) => {
        const updated = new Map(prev.entries());
        updated.set(userDetail.username, userDetail);
        return updated;
      });
    });

    try {
      const token = await apiService.fetchShareMapToken(sessionId);
      if (!token) {
        throw new Error('토큰이 정의되지 않았습니다');
      }
      const username = localStorageApi.getUserName();
      await session.connect(token, { clientData: username });
      const publisher = OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: false,
      });

      session.publish(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.error('세션 연결 중 오류 발생:', (error as Error).message);
    }
  };

  const joinSessionAndPatchAudioTag = async (sessionId: string) => {
    // console.log('---------- join session ----------', i++);

    if (sessionId) {
      await joinSession(sessionId);

      if (publisher) {
        const audioElement = document.getElementById(
          'publisherAudio',
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.srcObject = publisher.stream.getMediaStream();
        }
      }

      subscribers.forEach((subscriber, index) => {
        const audioElement = document.getElementById(
          `subscriberAudio${index}`,
        ) as HTMLAudioElement;

        if (audioElement) {
          audioElement.srcObject = subscriber.stream.getMediaStream();
        }
      });
    } else {
      console.error('세션 ID가 없습니다.');
    }
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
      const stores = await apiService.fetchStoresOfMapBoundary(bounds);

      addMarkers(mapInstance, stores);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  const fetchPostsAndSet = async (storeId: number) => {
    try {
      const posts = await apiService.fetchPostsOfStore(storeId);

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
        votedStores.filter(({ storeId: curStoreId }) => curStoreId != storeId),
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
    if (session) {
      session.signal({
        to: [],
        type: 'voteDone',
      });
    }
  };

  // voteUpdate 시그널을 받으면 누군가가 투표를 삭제하던 추가하던 voteList가 바뀌었으니 새로 받아와라 !
  const broadcastUpdateVoteListSIG = () => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (session) {
      session.signal({
        to: [],
        type: 'voteUpdate',
      });
    }
  };

  // 나 투표 하고싶어
  // ✅ TODO: 아무나 눌러도 다 시작됨
  const broadcastWantVoteStartSIG = () => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (session) {
      session.signal({
        to: [],
        type: 'voteStart',
      });
    }
  };

  const handleMyVoteDoneClick = () => {
    voteAllDone();
    broadcastImVoteDoneSIG();
    setDisableButton(true);
  };

  const voteAllDone = async () => {
    await fetchVoteResults();
    setIsVoteEnd(true);
    setIsVoteStart(false);
  };

  const leaveSession = async () => {
    if (session) {
      session.disconnect();
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

    setSession(() => null);
    setSubscribers(() => []);
    setPublisher(() => null);
  };

  useEffect(() => {
    console.log(isVoteStart);
  }, [isVoteStart]);

  const updateUserMarker = ({ userId: username, lat, lng }: UserLocation) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let overlay = userMarkers.current.get(username);
    // const name = localStorageApi.getName();
    // const userName = localStorageApi.getUserName();
    // console.log('name : ', name);
    console.log('userNAme : ', username);
    const profileImg = usersProfile.get(username)?.imageUrl;
    console.log(profileImg);
    console.log(usersProfile);

    const imageSrc = profileImg || '/profile/profile-default-icon-male.svg';
    const currentLevel = map.getLevel();

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

      // console.log('e.target : ', e.target);
      // console.log('e.target.lat:', lat, 'e.target.lng:', lng);
      // map.setLevel(level, {
      //   anchor: movePosition,
      //   animate: { duration: 1000 },
      // });

      // map.setCenter(movePostion);

      // const movePosition = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(movePosition);
      // map.setLevel(level);
      // map.setLevel(4, {
      //   anchor: movePosition,
      //   animate: { duration: 1000 },
      // });
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
      overlay.setMap(map);
      userMarkers.current.set(username, overlay);
    }
  };

  // 내 프로필을 SIG으로 subscriber에게 보냄
  const sendUserData = ({ imageUrl, username, name }: UserProfile) => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);
    console.log(imageUrl);

    if (session) {
      console.log('세션있음');
      session.signal({
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

    if (session) {
      session.signal({
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

    const center = map.getCenter();

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
          return apiService.fetchLiveOnStreamersOfStore(storeId);
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
        await apiService.fetchLiveOnStreamersOfStore(selectedStoreId);
      console.log('streamers : ', streamers);
      setStreamerFromStores(() => streamers);
    };

    fetchLiveStores(selectedStoreId);
  }, [selectedStoreId]);

  useEffect(() => {
    console.log('------ win store', voteWinStores);
  }, [voteWinStores]);

  // [ing 투표]
  if (isVoteStart) {
    return (
      <div className={s.startVoteContainer}>
        {/* 하위 태그 생성시 map이 안사라짐 */}
        <div className={s.startVoteWrapper}>
          <VotableCards
            stores={votedStores}
            handleAddVote={handleVoteStoreClick}
            handleDeleteVote={handleCancelVote}
          />

          {/* {votedStores.map((store) => {

            return (
              <VotedStoreCard
                key={store.storeId}
                {...store}
                handleAddVote={handleVoteStoreClick}
                handleDeleteVote={handleCancelVote}
              />
            );
          })} */}
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
    );
  } else if (isVoteEnd) {
    /* [end 개표] 결과 발표 */
    return (
      <>
        <ResultHeader />
        <div className={s.endVoteContainer}>
          <div className={s.top}>
            <LiveFriends liveFriends={streamerFromStores} />
            <div className={s.winningMsgArea}>
              <KingSVG />
              <Heading
                as="h3"
                color="white"
                fontSize="24px"
                fontWeight="medium"
                title={`${voteWinStores[0].storeName}이 우승했어요 !`}
              />
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
                      : '/profile/profile-default-icon-female.svg'
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
              <Heading
                as="h3"
                fontSize="16px"
                fontWeight="bold"
                color="black"
                title={`${selectedStore.storeName}에서 방송중이에요 !`}
              />
              <LiveFriends liveFriends={streamerFromStores} />
            </>
          )}
          <PostsOfMap
            selectedStoreName={selectedStore?.storeName}
            selectedStoreId={selectedStore?.storeId}
            posts={postsOfStore}
          />
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
              <Heading
                as="h3"
                fontSize="16px"
                fontWeight="bold"
                color="black"
                title="투표에 추가된 STORE"
              />
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

          {/* <div className={s.voteContainer}>
            <button
              className={s.voteRemoveButton}
              type="button"
              onClick={() => {
                if (!sessionId) return;

                deleteStoreFromVoteList(sessionId, selectedStoreId);
              }}
            >
              투표 삭제
            </button>
          </div> */}

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
    <div className={s.winStoreCardContainer}>
      <ImageFill
        src={url}
        id={String(storeId)}
        alt="vote-win-store-img"
        height="280px"
        fill
        borderRadius="24px"
      />
      <div className={s.titleArea}>
        <p className={s.storeName}>{storeName}</p>
        <p className={s.menuName}>{menuName}</p>
      </div>
    </div>
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
