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
  // const [bounds, setBounds] = useState({ left: 0, right: 0, up: 0, down: 0 });
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);

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

          const left = swLatLng.getLat();
          setLeft(left);
          const down = swLatLng.getLng();
          setDown(down);
          const right = neLatLng.getLat();
          setRight(right);
          const up = neLatLng.getLng();
          setUp(up);

          fetchStoresData(mapInstance, left, down, right, up);
        });
      });
    };

    script.onerror = () => {
      console.error('Failed to load Kakao Maps script.');
    };
  }, []);

  const fetchStoresData = (
    mapInstance: any,
    left: any,
    down: any,
    right: any,
    up: any,
  ) => {
    fetch(
      `https://wagubook.shop/map?left=${left}&right=${right}&up=${up}&down=${down}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          addMarkers(mapInstance, data);
        } else {
          console.error('서버로부터 받은 데이터가 배열이 아닙니다:', data);
        }
      })
      .catch((error) => {
        handleFetchError(error);
      });
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

      window.kakao.maps.event.addListener(marker, 'click', () => {
        fetchPostsData(store.storeId);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const fetchPostsData = (storeId: number) => {
    fetch(`https://wagubook.shop/mapposts?storeId=${storeId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Server returned data that is not an array:', data);
        }
      })
      .catch((error) => {
        handleFetchError(error);
      });
  };

  const trackMarkerPosition = (mapInstance: any, marker: any) => {
    window.kakao.maps.event.addListener(mapInstance, 'center_changed', () => {
      const position = marker.getPosition();
      const bounds = mapInstance.getBounds();

      if (!bounds.contain(position)) {
        const projection = mapInstance.getProjection();
        const anchorPoint = projection.pointFromCoords(position);
        const newPoint = adjustPointToBounds(anchorPoint, bounds);
        const newPosition = projection.coordsFromPoint(newPoint);
        marker.setPosition(newPosition);
      }
    });
  };

  const adjustPointToBounds = (
    point: { x: number; y: number },
    bounds: any,
  ) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    point.x = Math.max(sw.getLng(), Math.min(ne.getLng(), point.x));
    point.y = Math.max(sw.getLat(), Math.min(ne.getLat(), point.y));

    return point;
  };

  const handleFetchError = (error: any) => {
    if (error.status === 400) {
      console.error('Bad request:', error);
    } else if (error.status === 405) {
      console.error('Method not allowed:', error);
    } else if (error.status === 500) {
      console.error('Server error:', error);
    }
  };

  const createVoteUrl = () => {
    fetch('https://wagubook.shop/share', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Request failed: ${text}`);
          });
        }
        return response.text();
      })
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
