'use client';

import { useEffect, useState } from 'react';
import s from './page.module.scss';
import { error } from 'console';

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
        store.posx,
        store.posy,
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        key: store.storeId, // 여기 추가
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
        console.log('Fetch response data:', data); // 서버에서 반환되는 전체 데이터 확인
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
      console.error('Error data:', errorData); // 에러 데이터 확인
      errorMessage = `Error ${errorData.status}: ${errorData.error} - ${errorData.message}`;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
    }
    console.error('Fetch error details:', errorMessage);
  };

  const createVoteUrl = () => {
    fetch('https://wagubook.shop/share', {
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
        console.log('생성된 URL:', text);
      })
      .catch((error) => {
        console.error('URL 생성 오류:', error.message);
      });
  };

  return (
    <main className={s.container}>
      <header className={s.header}>
        <div className={s.profile}>
          <img src="/profile/ProfileMale.svg" alt="profile male" />
        </div>
        <div className={s.title}>
          <div className={s.icon}>
            <img src="/images/icons/icon-40x40.png" alt="star icon" />
          </div>
          <span>WAGU BOOK</span>
        </div>
        <div className={s.search}>
          <img src="/Search.svg" alt="search icon" />
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
        <button className={s.createUrlButton} onClick={createVoteUrl}>
          투표 URL 생성하기
        </button>
      </footer>
    </main>
  );
}
