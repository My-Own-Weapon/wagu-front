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

export default function SharePage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const userMarkers = useRef<Map<string, any>>(new Map());
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [markerImages, setMarkerImages] = useState<any[]>([]);
  const [centerMarkers, setCenterMarkers] = useState<any[]>([]);

  const OV = useRef<OpenVidu | null>(null);
  const searchParams = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [sessionId, setSessionId] = useState<any>(null);
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

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
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

  useEffect(() => {
    const [_, username] = document.cookie.split('=');
    fetch(`https://api.wagubook.shop:8080/member/${username}/profile`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        sendUserData(data.imageUrl, data.username);
      });
  }, [subscribers]);

  useEffect(() => {}, [userDetails]);

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

  useEffect(() => {
    if (voteCount == subscribers.length + 1) {
      voteDone();
    }
  }, [voteCount]);

  const joinSession = async (sessionId: string) => {
    OV.current = new OpenVidu();
    const session = OV.current.initSession();

    session.on('streamCreated', (event: any) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on('signal:userLocation', (event: any) => {
      const userLocation = JSON.parse(event.data);
      console.log('user위치 받음  내용 : ', userLocation);
      setUserLocations((prevLocations) => [...prevLocations, userLocation]);
      updateUserMarker(userLocation);
    });

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
      setUserDetails((prev) => {
        const updated = new Map(prev);
        updated.set(userDetail.username, userDetail);
        return updated;
      });
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

  const addMarkers = (mapInstance: any, storeData: StoreData[]) => {
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

  const fetchPostsData = (storeId: number, page: number, size: number) => {
    fetchData(
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

  const voteAdd = async (url: string, storeId: number) => {
    const res = await fetch(`https://api.wagubook.shop:8080/store/${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const selectedStore = await res.json();
    currSelectedStoreRef.current = selectedStore;
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

    await fetchVoteList(sessionId);
  };

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

  const fetchVoteList = async (sessionId: string) => {
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

  const sendVoteDone = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteDone',
      });
    }
  };

  const sendVoteUpdate = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteUpdate',
      });
    }
  };

  const sendVoteStart = () => {
    if (session) {
      session.signal({
        to: [],
        type: 'voteStart',
      });
    }
  };

  const myVoteDone = () => {
    sendVoteDone();
    setDisable(true);
  };

  const voteDone = () => {
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

  const sendUserData = (userImage: string, username: string) => {
    if (session) {
      session.signal({
        data: JSON.stringify({ userImage, username }),
        to: [],
        type: 'userData',
      });
    }
  };

  const sendLocation = (lat: number, lng: number) => {
    const [_, username] = document.cookie.split('=');
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

  const updateCenterLocation = () => {
    if (markers && !isVote) {
      var center = map.getCenter();
      sendLocation(center.getLat(), center.getLng());
    }
  };

  const showProfile = (url: string, userName: string) => {
    return (
      <div className={s.userProfileContainer}>
        <img src={url} alt={userName} width={50} height={50} />
        <div className={s.userName}>{userName}</div>
      </div>
    );
  };

  if (isVote) {
    return (
      <main className={s.container}>
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
        <div
          style={{
            backgroundColor: 'red',
          }}
        >
          {voteCount}
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
          {[...userDetails].map(([username, { imageUrl }]) => {
            if (imageUrl == null) {
              return showProfile(
                '/profile/profile-default-icon-male.svg',
                username,
              );
            }
            return showProfile(imageUrl, username);
          })}
        </div>

        {/* {showProfile('/profile/profile-default-icon-male.svg', 'user')} */}

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
        <div className={s.voteContainer}>
          <button
            className={s.voteAddButton}
            type="button"
            onClick={() => {
              voteAdd(sessionId, storeId);
            }}
          >
            투표 추가
          </button>
          <button
            className={s.voteRemoveButton}
            type="button"
            onClick={() => {
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
