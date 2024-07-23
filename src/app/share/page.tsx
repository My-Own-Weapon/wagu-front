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
import { useRouter, useSearchParams } from 'next/navigation';
import { OpenVidu, Subscriber } from 'openvidu-browser';
import Link from 'next/link';

import { Post } from '@/components/Post';
import StoreCards, { StoreCard, StoreVoteCard } from '@/components/StoreCard';
import LiveFriends from '@/components/LiveFriendsList';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { localStorageApi } from '@/services/localStorageApi';
import { apiService } from '@/services/apiService';

import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

interface StoreData {
  name: string;
  address: string;
  storeId: number;
  posx: number;
  posy: number;
}

interface UserLocation {
  userId: string;
  lat: number;
  lng: number;
}

interface VoteResult {
  storeId: number;
  storeName: string;
  menuImage: {
    id: number;
    url: string;
  };
  postCount: number;
}

const SEND_LOCATION_INTERVAL = 3000;
const MSG = {
  NO_SESSION_INSTANCE: 'session 인스턴스가 없습니다.',
  NO_SESSION_ID: 'session id가 없습니다.',
};

// let i = 0;

export default function SharePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;

  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const userMarkers = useRef<Map<string, any>>(new Map());
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [markerImages, setMarkerImages] = useState<any[]>([]);
  const [centerMarkers, setCenterMarkers] = useState<any[]>([]);

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<any>(null);
  // const [sessionId, setSessionId] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [stores, setStores] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<any>();
  const [isVote, setIsVote] = useState<boolean>(false);
  const [shareId, setShareId] = useState<string>();
  const currSelectedStoreRef = useRef<any>();
  const UserIconWithText = WithText<UserIconProps>(UserIcon);
  const [userDetails, setUserDetails] = useState(new Map());
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [isVoteDone, setIsVoteDone] = useState<boolean>(false);
  const [voteCount, setVoteCount] = useState<number>(0);
  const [disable, setDisable] = useState<boolean>(false);
  const [liveStores, setLiveStores] = useState<any[]>([]);

  useEffect(() => {
    console.log('--- 1');

    // 세션 생성 및 오디오 태그에 오디오 소스 연결
    // joinSessionAndPatchAudioTag(sessionId);

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
            37.297379834634675,
            127.03869108937842,
          ),
          level: 3,
        };

        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);

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
    console.log('---3 userName 서버에 전송');

    const username = localStorageApi.getUserName();
    /* 참가자가 들어오면 내 프로필을 가져오고 + 보내... (why: 내 프로필을 참여자에게 보냄 & 늦게들어오면 몰?루)
      if 내정보 있어 ? 내정보 가져와서 보내 : 서버에 요청해서 가져와서 보내
    */
    fetch(`https://api.wagubook.shop:8080/member/${username}/profile`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log('--- profile fetch', data);

        sendUserData(data.imageUrl, data.username, data.name);
      });
  }, [subscribers]);

  useEffect(() => {
    console.log('---4 kakao map 이벤트 등록');

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

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);
    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('10초');

      updateCenterLocation();
    }, SEND_LOCATION_INTERVAL);

    return () => clearInterval(interval);
  }, [markers]);

  useEffect(() => {
    if (voteCount == subscribers.length + 1) {
      voteAllDone();
    }
  }, [voteCount]);

  const joinSession = async (sessionId: string) => {
    console.log('--- join session !!!');

    const OV = new OpenVidu();
    setOV(OV);
    const session = OV.initSession();
    setSession(session);

    session.on('streamCreated', (event: any) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);
      // console.log('user위치 받음  내용 : ', userLocation);
      setUserLocations((prevLocations) => [...prevLocations, userLocation]);

      console.log('[SIG] userLocation : ', userLocation);

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
    session.on('signal:voteUpdate', async (event: any) => {
      event.preventDefault();
      await fetchVoteListAndSet(sessionId);
    });

    session.on('signal:voteStart', async (event: any) => {
      event.preventDefault();
      await setIsVote(true);
    });

    session.on('signal:voteDone', async (event: any) => {
      event.preventDefault();
      await updateVoteCount();
    });

    session.on('signal:userData', async (event: any) => {
      const userDetail = JSON.parse(event.data);
      console.log('---userDetails before', userDetail);
      userDetails.set(userDetail.username, userDetail);
      console.log('---userDetails after', userDetail);
      setUserDetails((prev) => {
        const updated = new Map(prev);
        updated.set(userDetail.username, userDetail);
        console.log('---updated', updated);
        return updated;
      });
    });

    try {
      const token = await getToken(sessionId);
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

  const getToken = async (sessionId: string) => {
    try {
      const responseToken = await fetch(
        `https://api.wagubook.shop:8080/api/sessions/${sessionId}/connections/voice`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      if (!responseToken.ok) {
        throw new Error(`토큰 요청 실패: ${responseToken.statusText}`);
      }

      const { token } = await responseToken.json();

      return token;
    } catch (error) {
      console.error('토큰 생성 중 오류 발생:', error);
      return null;
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
  const addMarkers = (mapInstance: any, storeData: StoreData[]) => {
    removeMarkers();

    if (!Array.isArray(storeData)) {
      console.error('storeData가 배열이 아닙니다:', storeData);
      return;
    }

    const newMarkers = storeData.map((store) => {
      const { kakao } = window;
      const imageSrc = '/images/map/ping_orange.svg';
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
        setStoreId(store.storeId);
        fetchPostsAndSet(store.storeId);
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

      setPosts(posts);
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

      setVoteResults(result);
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
      currSelectedStoreRef.current = selectedStoreDetails;
      const succMsg = await apiService.addStoreToVoteList(sessionId, storeId);
      await fetchVoteListAndSet(sessionId);

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

    const { dataset } = e.currentTarget;
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
  const deleteStoreFromVoteList = async (url: string, storeId: string) => {
    if (!sessionId || !storeId) {
      throw new Error('세션 ID 또는 store id가 없습니다.');
    }

    try {
      const succMsg = await apiService.deleteStoreFromVoteList(
        sessionId,
        storeId,
      );

      setStores(stores.filter(({ curStoreId }) => curStoreId != storeId));
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

  const fetchVoteListAndSet = async (sessionId: string | null) => {
    // if (!sessionId) return;

    const res = await fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}/vote/list`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const voteList = await res.json();

    setStores(() => voteList);
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
    broadcastImVoteDoneSIG();
    setDisable(true);
  };

  const voteAllDone = () => {
    fetchVoteResults();
    setIsVoteDone(true);
    setIsVote(false);
  };

  const onIncrease = () => {
    setVoteCount((voteCount) => voteCount + 1);
  };

  const updateVoteCount = async () => {
    await onIncrease();
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    if (publisher) {
      const mediaStream = publisher.stream.getMediaStream();
      if (mediaStream && mediaStream.getTracks) {
        // 모든 미디어 트랙 중지
        mediaStream
          .getTracks()
          .forEach((track: { stop: () => any }) => track.stop());
      }
    }

    setSession(null);
    setSubscribers([]);
    setPublisher(null);
  };

  const updateUserMarker = ({ userId, lat, lng }: UserLocation) => {
    console.log('--- updateUserMarker', userId, lat, lng);
    console.log('--- userMarkers :', userMarkers);

    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let marker = userMarkers.current.get(userId);

    const profileImg = userDetails.get(userId)?.userImage;
    const imageSrc = profileImg ?? '/profile/profile-default-icon-male.svg'; // 마커이미지의 주소입니다
    const imageSize = new window.kakao.maps.Size(40, 40); // 마커이미지의 크기입니다
    const imageOption = { offset: new window.kakao.maps.Point(20, 20) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const userMarkerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption,
    );

    if (marker) {
      console.log('마커있음', marker, markerPosition, userId);

      marker.setPosition(markerPosition);
    } else {
      console.log('마커없음', marker, markerPosition, userId);

      marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map,
        title: userId,
        image: userMarkerImage,
      });
      marker.setMap(map);
      userMarkers.current.set(userId, marker);
    }
  };

  // 내 프로필을 SIG으로 subscriber에게 보냄
  const sendUserData = (userImage: string, username: string, name: string) => {
    // if (!session) throw new Error(MSG.NO_SESSION_INSTANCE);

    if (session) {
      console.log('세션있음');
      session.signal({
        data: JSON.stringify({ userImage, username, name }),
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
    }
  };

  /* 투표화면으로 들어갔을때 실행되지 않도록
     ✅ TODO: isVoteDone 일때도 실행되지 않아야한다. */
  const updateCenterLocation = () => {
    if (markers && !isVote) {
      var center = map.getCenter();
      sendLocation(center.getLat(), center.getLng());
    }

    // console.log('없음');
  };

  const getStoreLive = async (storeId: number) => {
    const res = await fetch(
      `https://wagubook.shop:8080/map/live?storeId=${storeId}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    return res.json();
  };

  useEffect(() => {
    const fetchLiveStores = async () => {
      const liveStoresUpdates = await Promise.all(
        voteResults.map(({ storeId }) => getStoreLive(storeId)),
      );
      const flattedLiveStoresUpdates = liveStoresUpdates.flat();

      setLiveStores((prev) => [...prev, ...flattedLiveStoresUpdates]);
    };

    fetchLiveStores();
  }, [voteResults]);

  // 투표가 시작되었습니다.
  if (isVote) {
    return (
      <main className={s.container}>
        <div className={s.voteCardsContainer}>
          {stores.map((store) => {
            return (
              <StoreVoteCard
                key={store.storeId}
                {...store}
                handleAddVote={handleVoteStoreClick}
                handleDeleteVote={handleCancelVote}
              />
            );
          })}
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            color: '#212025',
            fontWeight: 'bold',
          }}
        >
          투표 종료한 사람 수 : {voteCount}
        </div>
        <button
          className={s.myVoteDone}
          type="button"
          onClick={handleMyVoteDoneClick}
          disabled={disable}
        >
          나의 투표 종료
        </button>
      </main>
    );
  } else if (isVoteDone) {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          gap: '10px',
        }}
      >
        {/* {liveStores.length > 0 ? (
          <LiveFriends liveFriends={liveStores} />
        ) : ( */}
        <LiveFriends liveFriends={liveStores} />
        {/* )} */}
        {voteResults.map(({ storeId, storeName, menuImage, postCount }) => {
          return (
            <StoreCard
              key={storeId}
              storeId={storeId}
              storeName={storeName}
              menuImage={menuImage}
              postCount={postCount}
            />
          );
        })}
      </div>
    );
  } else {
    return (
      <main className={s.container}>
        <div className={s.userContainer}>
          {[...userDetails].map(([username, { userImage, name }]) => {
            return (
              <UserIconWithText
                key={username}
                width={24}
                height={24}
                shape="circle"
                size="small"
                imgSrc={
                  !!userImage
                    ? userImage
                    : '/profile/profile-default-icon-female.svg'
                }
                alt="profile-icon"
              >
                {name}
              </UserIconWithText>
            );
          })}
        </div>
        <div className={s.mapContainer}>
          <div id="map" className={s.map} />
        </div>
        <div className={s.postContainer}>
          <Post.Wrapper>
            <Post>
              {posts.length === 0 ? (
                <Post.Title title="현재 선택된 post가 없어요! Post를 선택해보세요!" />
              ) : (
                <Post.Title title={`${posts[0].storeName}  Posts`} />
              )}
              {posts.length > 0 && <Post.PostCards posts={posts} />}
            </Post>
          </Post.Wrapper>
        </div>
        {stores.length > 0 && (
          <p
            style={{
              fontSize: '14px',
              color: '#212025999',
            }}
          >
            투표에 추가된 가게
          </p>
        )}
        <div className={s.voteListContainer}>
          {stores.map((store) => {
            return (
              <StoreVoteCard
                key={store.storeId}
                {...store}
                nobutton
                handleAddVote={handleVoteStoreClick}
                handleDeleteVote={handleCancelVote}
              />
            );
          })}
        </div>
        <div className={s.voteContainer}>
          <button
            className={s.voteAddButton}
            type="button"
            onClick={() => {
              if (!sessionId) return;
              handleAddStoreToVoteListClick(sessionId, storeId);
            }}
          >
            투표 추가
          </button>
          <button
            className={s.voteRemoveButton}
            type="button"
            onClick={() => {
              if (!sessionId) return;

              deleteStoreFromVoteList(sessionId, storeId);
            }}
          >
            투표 삭제
          </button>
        </div>
        <div className={s.voteStartContainer}>
          <button
            className={s.voteStartButton}
            type="button"
            onClick={() => {
              setIsVote(true);
              broadcastWantVoteStartSIG();
            }}
          >
            투표 시작
          </button>
        </div>
        <audio
          id="publisherAudio"
          autoPlay
          ref={(audio) => {
            if (audio && publisher) {
              audio.srcObject = publisher.stream.getMediaStream();
            }
          }}
        />
        {subscribers.map((subscriber, index) => (
          <audio
            key={index}
            id={`subscriberAudio${index}`}
            autoPlay
            ref={(audio) => {
              if (audio) {
                audio.srcObject = subscriber.stream.getMediaStream();
              }
            }}
          />
        ))}
      </main>
    );
  }
}
