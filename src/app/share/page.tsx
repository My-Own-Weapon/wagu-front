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
import { OpenVidu, Subscriber } from 'openvidu-browser';
import { useRouter, useSearchParams } from 'next/navigation';
import { Post } from '@/components/Post';
import { sharing } from 'webpack';
import StoreCards, { StoreCard, StoreVoteCard } from '@/components/StoreCard';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import Link from 'next/link';
import { localStorageApi } from '@/services/localStorageApi';
import LiveFriends from '@/components/LiveFriendsList';

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

const SEND_LOCATION_INTERVAL = 300000000000000;

// export const saveData = () => {
//   // 여기에 원하는 동작을 구현합니다. 예를 들어, 데이터를 저장하거나 로그를 남기는 작업을 수행합니다.
//   console.log('데이터 저장 중...');
// };

export default function SharePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const userMarkers = useRef<Map<string, any>>(new Map());
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [markerImages, setMarkerImages] = useState<any[]>([]);
  const [centerMarkers, setCenterMarkers] = useState<any[]>([]);

  const OV = useRef<OpenVidu | null>(null);
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
    const handleBeforeUnload = (event: any) => {
      // custom 함수 호출
      leaveSession();
      const confirmationMessage = '음성 연결이 해제됩니다.';
      event.returnValue = confirmationMessage; // Chrome에서는 returnValue를 설정해야 경고가 나타납니다.
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    console.log('---1 get sessionId---');
    // const sessionId = searchParams.get('sessionId');

    /* ❌ 없어도 됨  */
    if (sessionId) {
      // setSessionId(sessionId);
      fetch(`https://wagubook.shop:8080/share/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          return res.text();
        })
        .then((shareId) => {
          console.log('---- shareId:', shareId);
          setShareId(shareId);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('---2 kakao map script(인스턴스) 생성 ---');

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
    console.log('subscribers : ', subscribers);
    const username = localStorageApi.getUserName();
    /* 참가자가 들어오면 내 프로필을 가져오고 + 보내... (why: 내 프로필을 참여자에게 보냄 & 늦게들어오면 몰?루) 
      if 내정보 있어 ? 내정보 가져와서 보내 : 서버에 요청해서 가져와서 보내
    */
    // fetch(`https://api.wagubook.shop:8080/member/${username}/profile`, {
    //   method: 'GET',
    //   credentials: 'include',
    // })
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log('sendUserData 실행 : ', data);
    //     sendUserData(data.imageUrl, data.username, data.name);
    //   });
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
        handleJoinSession(sessionId);
      } else {
        throw new Error('세션 ID가 없습니다.');
      }
    }
  }, [map]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('10초');

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

    OV.current = new OpenVidu();
    const session = OV.current.initSession();

    session.on('streamCreated', (event: any) => {
      // 내가 자신의 구독자가 되는 상황을 막기 위해 필터링
      if (
        event.stream.connection.connectionId !== session.connection.connectionId
      ) {
        console.log('누군가 세션에 들어오면 세션에 있는 참가자들은 이걸 받음!');
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        console.log('streamCreate받음 : subscribers', subscribers);
      } else {
        console.log('내가 나의 구독자이면 안됨!!!');
      }
    });

    session.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);
      console.log('user위치 받음  내용 : ', userLocation);
      setUserLocations((prevLocations) => [...prevLocations, userLocation]);
      updateUserMarker(userLocation);
    });

    // 나 투표했으니까 다들 투표된거 업데이트해
    session.on('signal:voteUpdate', async (event: any) => {
      event.preventDefault();
      await fetchVoteList(sessionId);
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
      userDetails.set(userDetail.username, userDetail);
      console.log('userData 받음1111 userDetails : ', userDetails);
      setUserDetails((prev) => {
        const updated = new Map(prev);
        updated.set(userDetail.username, userDetail);
        console.log('userData 받음2222 userDetails : ', userDetails);
        return updated;
      });
    });

    try {
      console.log('세션이 연결된 후 제일 먼저 실행!');
      const token = await getToken(sessionId);
      if (!token) {
        throw new Error('토큰이 정의되지 않았습니다');
      }
      const username = localStorageApi.getUserName();
      await session.connect(token, { clientData: username });
      const publisher = OV.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: false,
        publishAudio: true,
        publishVideo: false,
      });

      session.publish(publisher);
      setSession(session);
      setPublisher(publisher);
      console.log('setPublisher 실행 , publisher : ', publisher);
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

  const handleJoinSession = async (sessionId: string) => {
    if (sessionId) {
      await joinSession(sessionId);
      console.log('handleJoinSession 실행 // publisher : ', publisher);
      if (publisher) {
        const audioElement = document.getElementById(
          'publisherAudio',
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.srcObject = publisher.stream.getMediaStream();
          audioElement.muted = true;
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
    /* 불변성 */
    removeMarkers();

    if (!Array.isArray(storeData)) {
      console.error('storeData가 배열이 아닙니다:', storeData);
      return;
    }

    const newMarkers = storeData.map((store) => {
      const markerPosition = new window.kakao.maps.LatLng(
        store.posy,
        store.posx,
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        key: store.storeId,
      });

      marker.setMap(mapInstance);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        setStoreId(store.storeId);
        fetchPostsData(store.storeId, 0, 10);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const fetchStores = (url: string) => {
    return fetch(url, { method: 'GET', credentials: 'include' }).then(
      (response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      },
    );
  };

  const fetchStoresData = (
    mapInstance: any,
    bounds: { left: number; down: number; right: number; up: number },
  ) => {
    const { left, down, right, up } = bounds;

    /* 지우고 다시 받아와서 마커 설정 */
    fetchStores(
      `https://api.wagubook.shop:8080/map?left=${left}&right=${right}&up=${up}&down=${down}`,
    )
      .then((data) => {
        if (Array.isArray(data)) {
          addMarkers(mapInstance, data);
        } else {
          console.error('서버로부터 받은 데이터가 배열이 아닙니다:', data);
        }
      })
      .catch(handleFetchError);
  };

  /* 스토어에 대한 포스트들 fetch */
  const fetchPostsData = (storeId: number, page: number, size: number) => {
    fetchStores(
      `https://api.wagubook.shop:8080/map/posts?storeId=${storeId}&page=${page}&size=${size}`,
    )
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('서버가 배열이 아닌 데이터를 반환했습니다:', data);
        }
      })
      .catch((error) => {
        handleFetchError(error);
      });
  };

  /* 투표 결과를 받아온다 */
  const fetchVoteResults = () => {
    fetch(`https://api.wagubook.shop:8080/share/${sessionId}/result`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setVoteResults(data);
        } else {
          console.error('서버로부터 받은 데이터가 배열이 아닙니다:', data);
        }
      })
      .catch((error) => {
        console.error('투표 결과를 가져오는 중 오류 발생:', error);
      });
  };

  // 투표 list에 추가하기 위한 함수
  const voteAdd = async (url: string, storeId: number) => {
    // id로 식당을 검색 후 정보 찾아와서
    const res = await fetch(`https://api.wagubook.shop:8080/store/${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const selectedStore = await res.json();
    currSelectedStoreRef.current = selectedStore;

    // 찾은 식당 정보를 투표에 추가
    await fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('이미 추가된 가게입니다.');
        }
        return res.text();
      })
      .then((message) => {
        sendVoteUpdate();
        alert(message);
      })
      .catch((error) => {
        alert(error.message);
      });

    // 투표에 추가한 가게들을 받아와서 재할당 불변성
    await fetchVoteList(sessionId);
  };

  // const fetchVoteList = async (sessionId: string) => {
  //   const res = await fetch(
  //     `https://api.wagubook.shop:8080/share/${sessionId}/vote/list`,
  //     {
  //       method: 'GET',
  //       credentials: 'include',
  //     },
  //   );
  //   const voteList = await res.json();
  //   setStores(() => voteList);
  // };

  // [AFTER 투표] 투표가 시작되었을때 가게 카드에서 투표버튼 핸들러
  const handleAddVote: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    const { currentTarget } = e;
    const { dataset } = currentTarget;
    const { storeId } = dataset;

    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )
      .then((res) => {
        return res.text();
      })
      .then((message) => {
        alert(message);
      })
      .catch((e) => {
        throw e;
      });
  };

  // [BEFORE 투표] 투표가 ⛔️시작되기전⛔️에 가게 카드에서 투표버튼 ⭐️ 핸들러
  const voteDelete = (url: string, selectedStoreId: string) => {
    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}?store_id=${selectedStoreId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('이미 삭제된 가게입니다.');
        }
        return res.text();
      })
      .then((message) => {
        setStores(stores.filter(({ storeId }) => storeId != selectedStoreId));
        sendVoteUpdate();
        alert(message);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // [AFTER 투표] 투표 추가 버튼색이 빨강으로 변하면서 등록되는 함수
  const handleDeleteVote: MouseEventHandler<HTMLButtonElement> = (e) => {
    const { currentTarget } = e;
    const { dataset } = currentTarget;
    const { storeId } = dataset;

    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    )
      .then((res) => {
        return res.text();
      })
      .then((message) => {
        alert(message);
      })
      .catch((e) => {
        throw e;
      });
  };

  const fetchVoteList = async (sessionId: string | null) => {
    if (!sessionId) return;

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
  const sendVoteDone = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteDone',
      });
    }
  };

  // voteUpdate 시그널을 받으면 누군가가 투표를 삭제하던 추가하던 voteList가 바뀌었으니 새로 받아와라 !
  const sendVoteUpdate = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteUpdate',
      });
    }
  };

  // 나 투표 하고싶어
  // ✅ TODO: 아무나 눌러도 다 시작됨
  const sendVoteStart = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteStart',
      });
    }
  };

  // [AFTER 투표]에서 나 투표 끝냈어
  const myVoteDone = () => {
    sendVoteDone();
    setDisable(true);
  };

  // [AFTER 투표] 모두 투표가 끝났어
  const voteAllDone = () => {
    fetchVoteResults();
    setIsVoteDone(true);
    setIsVote(false);
  };

  const handleFetchError = async (error: Response) => {
    let errorMessage = '알 수 없는 에러 발생';
    try {
      const errorData = await error.json();
      console.error('오류 데이터:', errorData);
      errorMessage = `오류 ${errorData.status}: ${errorData.error} - ${errorData.message}`;
    } catch (jsonError) {
      console.error('JSON 파싱 오류:', jsonError);
    }
    console.error('Fetch 오류 세부 사항:', errorMessage);
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

    setSession(null);
    setSubscribers([]);
    setPublisher(null);
  };

  const updateUserMarker = ({ userId, lat, lng }: UserLocation) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let marker = userMarkers.current.get(userId);

    const imageSrc = '/profile/profile-default-icon-male.svg'; // 마커이미지의 주소입니다
    const imageSize = new window.kakao.maps.Size(40, 40); // 마커이미지의 크기입니다
    const imageOption = { offset: new window.kakao.maps.Point(20, 20) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const userMarkerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption,
    );

    if (marker) {
      marker.setPosition(markerPosition);
    } else {
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
    if (session) {
      session.signal({
        data: JSON.stringify({ userImage, username, name }),
        to: subscribers,
        type: 'userData',
      });
    }
  };

  // 내 위치를 SIG으로 subscriber에게 보냄
  const sendLocation = (lat: number, lng: number) => {
    console.log('sendLocation 실행 , subscribers', subscribers);
    console.log('sendLocation 실행 , publisher', publisher);
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

    console.log('없음');
  };

  const showProfile = (url: string, userName: string) => {
    return (
      <div className={s.userProfileContainer}>
        <img src={url} alt={userName} width={50} height={50} />
        <div className={s.userName}>{userName}</div>
      </div>
    );
  };

  const getStoreLive = async (storeId: number) => {
    console.log(storeId);

    const res = await fetch(
      `https://wagubook.shop:8080/map/live?storeId=${storeId}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    console.log(res);

    return res.json();
  };

  // useEffect(() => {
  //   console.log('vote result 바뀜', voteResults);

  //   voteResults.forEach(async ({ storeId }) => {
  //     const liveStore = await getStoreLive(storeId);

  //     console.log(liveStore);

  //     if (liveStores.length > 0) {
  //       setLiveStores((prev) => [...prev, ...liveStore]);
  //     }
  //   });
  // }, [voteResults]);

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
                handleAddVote={handleAddVote}
                handleDeleteVote={handleDeleteVote}
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
          onClick={myVoteDone}
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
          {[...userDetails].map(([username, { imageUrl, name }]) => {
            return (
              <UserIconWithText
                key={username}
                width={24}
                height={24}
                shape="circle"
                size="small"
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
                handleAddVote={handleAddVote}
                handleDeleteVote={handleDeleteVote}
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
              voteAdd(sessionId, storeId);
            }}
          >
            투표 추가
          </button>
          <button
            className={s.voteRemoveButton}
            type="button"
            onClick={() => {
              if (!sessionId) return;

              voteDelete(sessionId, storeId);
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
              sendVoteStart();
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
