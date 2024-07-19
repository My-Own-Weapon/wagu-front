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

import { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { OpenVidu, Subscriber } from 'openvidu-browser';
import { useRouter, useSearchParams } from 'next/navigation';
import { Post } from '@/components/Post';
import { sharing } from 'webpack';
import StoreCards, { StoreCard, StoreVoteCard } from '@/components/StoreCard';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
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
  imageUrl: string;
  userName: string;
}

interface UserDetail {
  imageUrl: string;
  userName: string;
}

interface VoteResult {
  storeName: string;
  storeAddress: string;
  storeId: number;
  posx: number;
  posy: number;
  votes: number;
}

export default function SharePage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const OV = useRef<OpenVidu | null>(null);
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const userMarkers = useRef<Map<string, any>>(new Map());
  const [storeId, setStoreId] = useState<any>();
  const [isVote, setIsVote] = useState<boolean>(false);
  const [shareId, setShareId] = useState<string>();
  const currSelectedStoreRef = useRef<any>();
  const UserIconWithText = WithText<UserIconProps>(UserIcon);
  const [userDetails, setUserDetails] = useState<UserDetail>();
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [isVoteDone, setIsVoteDone] = useState<boolean>(false);

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    console.log('sessionId : ', sessionId);
    if (sessionId) {
      setSessionId(sessionId);
      fetch(`https://wagubook.shop:8080/share/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          return res.text();
        })
        .then((shareId) => {
          console.log('shareId : ', shareId);
          setShareId(shareId);
        });
    }
  }, [searchParams]);

  useEffect(() => {
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

  const fetchData = (url: string) => {
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
    fetchData(
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

  const handleAddVote: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    console.log(e);

    const { currentTarget } = e;
    const { dataset } = currentTarget;
    const { storeId } = dataset;

    console.log('shareId:', shareId);
    console.log('storeId:', storeId);

    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )
      .then((res) => {
        console.log(res);
        return res.text();
      })
      .then((message) => {
        console.log(message);
        alert(message);
      })
      .catch((e) => {
        console.log(e.message);
        throw e;
      });
  };

  const handleDeleteVote: MouseEventHandler<HTMLButtonElement> = (e) => {
    const { currentTarget } = e;
    const { dataset } = currentTarget;
    const { storeId } = dataset;

    console.log('shareId:', shareId);
    console.log('storeId:', storeId);

    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    )
      .then((res) => {
        console.log(res);
        return res.text();
      })
      .then((message) => {
        console.log(message);
        alert(message);
      })
      .catch((e) => {
        console.log(e.message);
        throw e;
      });
  };

  const addMarkers = (mapInstance: any, storeData: StoreData[]) => {
    console.log('상점 데이터에 마커 추가하기:', storeData);
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
      console.log('마커 추가됨:', marker);

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

  const fetchPostsData = (storeId: number, page: number, size: number) => {
    console.log(`Fetching posts for store ID: ${storeId}`);
    fetchData(
      `https://api.wagubook.shop:8080/map/posts?storeId=${storeId}&page=${page}&size=${size}`,
    )
      .then((data) => {
        console.log('Fetched posts data:', data);
        if (Array.isArray(data)) {
          console.log(data);
          setPosts(data);
        } else {
          console.error('서버가 배열이 아닌 데이터를 반환했습니다:', data);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        handleFetchError(error);
      });
  };

  const voteAdd = async (url: string, storeId: number) => {
    const res = await fetch(`https://api.wagubook.shop:8080/store/${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    console.log(res);
    console.log('res.ok', stores);
    const selectedStore = await res.json();
    currSelectedStoreRef.current = selectedStore;
    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error('이미 추가된 가게입니다.');
        }
        return res.text();
      })
      .then((message) => {
        // setStores([...stores, currSelectedStoreRef.current]);
        sendVoteAdd(currSelectedStoreRef.current);
        console.log(message);
        alert(message);
      })
      .catch((error) => {
        alert(error.message);
      });

    fetch(`https://api.wagubook.shop:8080/share/${sessionId}/vote/list`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return JSON.stringify(res.formData);
      })
      .then((data) => {
        console.log('[][][][][][][]result : ', data);
        setStores([stores, res.body]);
        console.log('GET VOTE LIST : ', stores);
      });
  };

  const sendVoteAdd = (store: any) => {
    if (session) {
      session.signal({
        data: JSON.stringify({ store }),
        to: [],
        type: 'addVote',
      });
    }
  };

  const voteDelete = (url: string, selectedStoreId: string) => {
    fetch(
      `https://api.wagubook.shop:8080/share/${sessionId}?store_id=${selectedStoreId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error('이미 삭제된 가게입니다.');
        }
        return res.text();
      })
      .then((message) => {
        setStores(stores.filter(({ storeId }) => storeId != selectedStoreId));
        sendVoteDelete(storeId);
        console.log(message);
        alert(message);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const sendVoteDelete = (storeId: number) => {
    if (session) {
      session.signal({
        data: JSON.stringify({ storeId }),
        to: [],
        type: 'voteDelete',
      });
    }
  };

  const voteDone = () => {
    fetchVoteResults();
    setIsVoteDone(true);
  };

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
          console.log('SETRESULT 성공: ', voteResults);
        } else {
          console.error('서버로부터 받은 데이터가 배열이 아닙니다:', data);
        }
      })
      .catch((error) => {
        console.error('투표 결과를 가져오는 중 오류 발생:', error);
      });
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

  const joinSession = async (sessionId: string) => {
    OV.current = new OpenVidu();
    const session = OV.current.initSession();

    session.on('streamCreated', (event: any) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);
      setUserLocations((prevLocations) => [...prevLocations, userLocation]);
      updateUserMarker(userLocation);
    });

    session.on('signal:addVote', (event: any) => {
      event.preventDefault();
      const { store } = JSON.parse(event.data);
      console.log('시그널');
      console.log(event.data);
      console.log(event.from);
      console.log(event.type);
      // const { storeId } = event.data;
      // const { storeId: realstoreId } = storeId;
      const store2 = store.store;
      console.log('@@@@@@@@@@@@@@@@@@@@@', store);
      console.log('!!!!!', store2);
      setStores([...stores, store]);
    });

    try {
      const token = await getToken(sessionId);
      if (!token) {
        throw new Error('토큰이 정의되지 않았습니다');
      }
      const [_, username] = document.cookie.split('=');
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

      console.log(`세션 ID에 참여: ${sessionId}`);
    } catch (error) {
      console.error('세션 연결 중 오류 발생:', (error as Error).message);
    }
  };

  const getToken = async (sessionId: string) => {
    try {
      console.log(sessionId);
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
      console.log(`생성된 세션 ID: ${sessionId}`);
      console.log(`생성된 토큰: ${token}`);

      return token;
    } catch (error) {
      console.error('토큰 생성 중 오류 발생:', error);
      return null;
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setPublisher(null);
  };

  const handleJoinSession = async () => {
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

  const updateUserMarker = ({ userId, lat, lng }: UserLocation) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    let marker = userMarkers.current.get(userId);

    if (marker) {
      marker.setPosition(markerPosition);
      console.log('[ set position ] userId : ', userId);
    } else {
      marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map,
        title: userId,
      });
      marker.setMap(map);
      console.log('[ set position ] userId : ', userId);
      userMarkers.current.set(userId, marker);
    }

    console.log('사용자 위치 마커 업데이트:', marker);
  };

  const sendLocation = (lat: number, lng: number) => {
    if (session) {
      const [_, username] = document.cookie.split('=');
      console.log('[ sendLocation 시작 ] username : ', username);
      fetch(`https://api.wagubook.shop:8080/member/${username}/profile`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          console.log('프로필 요청 성공 : ', res);
          if (!res.ok) {
            throw new Error('프로필 이미지 받아오기 실패');
          }
          return res.json();
        })
        .then((data) => {
          console.log('data: ', data);
          setUserDetails(data);
        });

      session.signal({
        data: JSON.stringify({ userId: username, lat, lng, userDetails }),
        to: [],
        type: 'userLocation',
      });
    }
  };

  const updateCenterLocation = () => {
    if (markers && !isVote) {
      var center = map.getCenter();
      sendLocation(center.getLat(), center.getLng());
    }
  };

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(
        map,
        'center_changed',
        updateCenterLocation,
      );
    }
  }, [map]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('10초');
      updateCenterLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, [markers]);

  if (isVote) {
    console.log('투표화면 시작');
    console.log(stores);

    return (
      <main className={s.container}>
        {/* <StoreCards stores={stores} /> */}
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
        <button className={s.myVoteDone} type="button" onClick={voteDone}>
          나의 투표 종료
        </button>
      </main>
    );
  } else if (isVoteDone) {
    <div>투표결과 여기 나옴</div>;
  } else {
    return (
      <main className={s.container}>
        {/* <div className={s.userContainer}>
          {userLocations.map((userLocation) => {
            return (
              <li
                key={userLocation.userId}
                style={{
                  display: 'flex',
                }}
              >
                <UserIconWithText
                  width={40}
                  height={40}
                  shape="circle"
                  size="small"
                  imgSrc={
                    !!userLocation.imageUrl
                      ? userLocation.imageUrl
                      : '/profile/profile-default-icon-female.svg'
                  }
                  alt="profile-icon"
                >
                  {userLocation.userName}
                </UserIconWithText>
              </li>
            );
          })} */}
        {/* </div> */}
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
        <button type="button" onClick={handleJoinSession}>
          음성 채팅 시작
        </button>
        <button type="button" onClick={leaveSession}>
          음성 채팅 종료
        </button>
        <div className={s.voteListContainer}>
          {stores.map((store) => {
            console.log(store);
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

        <div className={s.voteAdd}>
          <button
            type="button"
            onClick={() => {
              voteAdd(sessionId, storeId);
            }}
          >
            투표 추가
          </button>
        </div>
        <div className={s.voteRemove}>
          <button
            type="button"
            onClick={() => {
              voteDelete(sessionId, storeId);
            }}
          >
            투표 삭제
          </button>
        </div>
        <div className={s.voteStart}>
          <button
            type="button"
            onClick={() => {
              setIsVote(true);
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
