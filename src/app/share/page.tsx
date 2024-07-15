'use client';

import { useEffect, useState, useRef } from 'react';
import { OpenVidu, Subscriber } from 'openvidu-browser';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function KakaoMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const OV = useRef<OpenVidu | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      setSessionId(sessionId);
    } else {
      createSession();
    }
  }, [searchParams]);

  const createSession = async () => {
    try {
      const response = await fetch('https://video.wagubook.shop/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const newSessionId = await response.text();
      setSessionId(newSessionId);
      router.push(`/share?sessionId=${newSessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

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
      `https://wagubook.shop/map?left=${left}&right=${right}&up=${up}&down=${down}`,
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

      window.kakao.maps.event.addListener(marker, 'click', () =>
        fetchPostsData(store.storeId),
      );

      return marker;
    });

    setMarkers(newMarkers);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const fetchPostsData = (storeId: number) => {
    console.log(`Fetching posts for store ID: ${storeId}`);
    fetchData(`https://wagubook.shop/map/posts?storeId=${storeId}`)
      .then((data) => {
        console.log('Fetch response data:', data);
        if (Array.isArray(data)) {
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

  const handleFetchError = async (error: Response) => {
    let errorMessage = '알 수 없는 에러 발생';
    try {
      const errorData = await error.json();
      console.error('Error data:', errorData);
      errorMessage = `Error ${errorData.status}: ${errorData.error} - ${errorData.message}`;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
    }
    console.error('Fetch error details:', errorMessage);
  };

  const joinSession = async (sessionId: string) => {
    OV.current = new OpenVidu();
    const session = OV.current.initSession();

    session.on('streamCreated', (event: any) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    try {
      const token = await getToken(sessionId);
      if (!token) {
        throw new Error('Token is undefined');
      }
      await session.connect(token, { clientData: 'User' });
      const publisher = OV.current.initPublisher(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: false, // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: false, // Whether you want to start publishing with your video enabled or not
      });

      session.publish(publisher);
      setSession(session);
      setPublisher(publisher);

      console.log(`Joined session ID: ${sessionId}`);
    } catch (error) {
      console.error(
        'There was an error connecting to the session:',
        (error as Error).message,
      );
    }
  };

  const getToken = async (sessionId: string) => {
    const responseToken = await fetch(
      `https://video.wagubook.shop/api/sessions/${sessionId}/connections`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const token = await responseToken.text();

    console.log(`Created session ID: ${sessionId}`);
    console.log(`Generated token: ${token}`);

    return token;
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setPublisher(null);
  };

  const handleJoinSession = () => {
    if (sessionId) {
      joinSession(sessionId);
    } else {
      console.error('세션 ID가 없습니다.');
    }
  };

  return (
    <main className={s.container}>
      <header className={s.header}>
        <div className={s.title}>
          <span>WAGU BOOK</span>
        </div>
      </header>
      <div className={s.mapContainer}>
        <div id="map" className={s.map}></div>
      </div>
      <div className={s.postsContainer}>
        {posts.length > 0 && (
          <>
            <h2>{posts[0].storeName} Posts</h2>
            <div className={s.posts}>
              {posts.map((post) => (
                <div key={post.postId} className={s.post}>
                  <img
                    src={post.menuImage.url}
                    alt={post.postMainMenu}
                    onError={(e) =>
                      console.error(
                        `Image load error: ${post.menuImage.url}`,
                        e,
                      )
                    }
                  />
                  <div>{post.postMainMenu}</div>
                  <div>{post.createdDate}</div>
                  <div>{post.menuPrice}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <footer className={s.footer}>
        <button className={s.joinButton} onClick={handleJoinSession}>
          음성 채팅 시작
        </button>
        <button className={s.leaveButton} onClick={leaveSession}>
          음성 채팅 종료
        </button>
      </footer>
    </main>
  );
}
