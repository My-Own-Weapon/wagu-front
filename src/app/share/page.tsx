'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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

interface Peer {
  id: string;
  stream: MediaStream;
}

export default function KakaoMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const ws = useRef<WebSocket | null>(null);
  const localStream = useRef<MediaStream | null>(null);
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
            left: swLatLng.getLat(),
            down: swLatLng.getLng(),
            right: neLatLng.getLat(),
            up: neLatLng.getLng(),
          });
        });
      });
    };

    script.onerror = () => {
      console.error('카카오 지도 스크립트를 불러오지 못했습니다.');
    };

    if (sessionId && sessionId.length === 10) {
      startWebRTC(sessionId);
    }
  }, [sessionId]);

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
        store.posx,
        store.posy,
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

  const startWebRTC = async (sessionId: string) => {
    const wsUrl = `wss://video.wagubook.shop/openvidu?sessionId=${sessionId}`;
    ws.current = new WebSocket(wsUrl);
    ws.current.onmessage = handleSignalingMessage;

    // 로컬 오디오 스트림 가져오기
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }

    if (ws.current) {
      ws.current.onopen = () => {
        createOffer();
      };
    }
  };

  const handleSignalingMessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data);

    switch (data.type) {
      case 'offer':
        handleOffer(data);
        break;
      case 'answer':
        handleAnswer(data);
        break;
      case 'candidate':
        handleCandidate(data);
        break;
      default:
        break;
    }
  };

  const handleOffer = async (data: any) => {
    const pc = createPeerConnection(data.from);
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    ws.current?.send(
      JSON.stringify({
        type: 'answer',
        answer: answer,
        to: data.from,
      }),
    );
  };

  const handleAnswer = async (data: any) => {
    const pc = peerConnections.current[data.from];
    await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleCandidate = (data: any) => {
    const pc = peerConnections.current[data.from];
    const candidate = new RTCIceCandidate(data.candidate);
    pc.addIceCandidate(candidate);
  };

  const createPeerConnection = (id: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(
          JSON.stringify({
            type: 'candidate',
            candidate: event.candidate,
            to: id,
          }),
        );
      }
    };

    pc.ontrack = (event) => {
      setPeers((prevPeers) => [...prevPeers, { id, stream: event.streams[0] }]);
    };

    localStream.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current!);
    });

    peerConnections.current[id] = pc;
    return pc;
  };

  const createOffer = async () => {
    const id = Math.random().toString(36).substring(2, 15);
    const pc = createPeerConnection(id);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.current?.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
        from: id,
      }),
    );
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
      <footer className={s.footer}></footer>
    </main>
  );
}
