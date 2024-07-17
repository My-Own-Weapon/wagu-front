/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostCardProps } from '@/components/Post';
import useDragScroll from '@/hooks/useDragScroll';
import LiveFriends, { Friend } from '@/components/LiveFriendsList';
import s from './page.module.scss';
import VoteUrlModal from '@/components/VoteUrlModal';
import { application } from 'express';

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

interface PostData {
  postId: number;
  storeName: string;
  postMainMenu: string;
  menuImage: { url: string };
  createdDate: string;
  menuPrice: string;
}

export default function KakaoMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태 관리
  const [voteUrl, setVoteUrl] = useState(''); // 생성된 URL 저장
  const router = useRouter();
  const ref = useDragScroll();
  const [liveFriends, setLiveFriends] = useState<Friend[]>([]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
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
    console.log('Fetching stores data with bounds:', bounds);
    fetchData(
      `https://api.wagubook.shop:8080/map?left=${left}&right=${right}&up=${up}&down=${down}`,
    )
      .then((data) => {
        console.log('Fetched stores data:', data);
        if (Array.isArray(data)) {
          addMarkers(mapInstance, data);
          console.log(data);
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

      window.kakao.maps.event.addListener(marker, 'click', () => {
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

  // Error handling
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

  const createVoteUrl = () => {
    fetch('https://api.wagubook.shop:8080/share', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`요청 실패됨: ${text}`);
          });
        }
        return response.text();
      })

      .then((text) => {
        fetch('https://api.wagubook.shop:8080/api/sessions', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customSessionId: text,
          }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error('세션 생성 실패');
          }
          console.log('생성된 URL:', text);
          setVoteUrl('https://www.wagubook.shop/share?sessionId=' + text); // 생성된 URL 설정
          setModalIsOpen(true);
        });
      })
      .catch((error) => {
        console.error('URL 생성 오류:', error.message);
      });
  };

  const renderPost = (post: PostData) => (
    <div
      key={post.postId}
      onClick={() => {
        if (post.postId) {
          router.push(`http://www.wagubook.shop:3000/posts/${post.postId}`);
        } else {
          console.error('postId가 정의되지 않았습니다.');
        }
      }}
    >
      <img
        src={post.menuImage?.url || '/images/default-image.png'}
        alt={post.postMainMenu}
        onError={(e) => {
          console.error(`Image load error: ${post.menuImage?.url}`, e);
        }}
      />
      <div>{post.postMainMenu}</div>
      <div>{post.createdDate}</div>
      <div>{post.menuPrice}</div>
    </div>
  );

  return (
    <main className={s.container}>
      <div className={s.mapContainer}>
        <div id="map" className={s.map} />
      </div>
      <div>
        <LiveFriends liveFriends={liveFriends} />
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
      </div>
      <div className={s.urlContainer}>
        <button
          className={s.createUrlButton}
          type="button"
          onClick={createVoteUrl}
        >
          투표 URL 생성하기
        </button>
      </div>
      <VoteUrlModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        voteUrl={voteUrl}
      />
    </main>
  );
}
