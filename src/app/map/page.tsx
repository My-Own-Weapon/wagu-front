'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) {
          console.error('Map container not found');
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
      console.error('Failed to load Kakao Maps script.');
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
    console.log('Adding markers for store data:', storeData);
    removeMarkers();

    if (!Array.isArray(storeData)) {
      console.error('storeData is not an array:', storeData);
      return;
    }

    const newMarkers = storeData.map((store) => {
      const markerPosition = new window.kakao.maps.LatLng(
        store.posx,
        store.posy,
      );
      const marker = new window.kakao.maps.Marker({ position: markerPosition });

      marker.setMap(mapInstance);
      console.log('Marker added:', marker);

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
    fetchData(`https://wagubook.shop/mapposts?storeId=${storeId}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Server returned data that is not an array:', data);
        }
      })
      .catch(handleFetchError);
  };

  const handleFetchError = (error: { status: number }) => {
    const errorMessages: { [key: number]: string } = {
      400: 'Bad request',
      405: 'Method not allowed',
      500: 'Server error',
    };
    console.error(errorMessages[error.status] || 'Unknown error:', error);
  };

  const createVoteUrl = () => {
    fetchData('https://wagubook.shop/share')
      .then((text) => {
        console.log('Generated URL:', text);
      })
      .catch((error) => {
        console.error('Error generating URL:', error.message);
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
                <div key={post.id} className={s.post}>
                  <img src={post.image} alt={post.name} />
                  <div>{post.name}</div>
                  <div>{post.date}</div>
                  <div>{post.price}</div>
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
