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
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
  const [markers, setMarkers] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Kakao Maps script loaded.');
      window.kakao.maps.load(() => {
        console.log('Kakao Maps API loaded.');

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

        const map = new window.kakao.maps.Map(container, options);
        console.log('Map object created:', map);
        setMap(map);

        window.kakao.maps.event.addListener(map, 'idle', function () {
          const bounds = map.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          console.log('현재 지도 범위 좌하단:', swLatLng.toString());
          console.log('현재 지도 범위 우상단:', neLatLng.toString());

          const left = swLatLng.getLat();
          setLeft(left);
          const down = swLatLng.getLng();
          setDown(down);
          const right = neLatLng.getLat();
          setRight(right);
          const up = neLatLng.getLng();
          setUp(up);

          console.log(
            `left: ${left}, down: ${down}, right: ${right}, up: ${up}`,
          );

          /* 지도 화면을 이동할 때마다 호출하는 형식 */
          fetch(
            `https://api.wagubook.shop/map?left=${left}&right=${right}&up=${up}&down=${down}`,
            {
              method: 'GET',
              credentials: 'include' /* 나중에 수정 */,
            },
          )
            .then((response) => {
              if (!response.ok) {
                throw response;
              }
              return response.json();
            })
            .then((data) => {
              console.log('서버로부터 받은 데이터:', data);
              if (Array.isArray(data)) {
                addMarkers(map, data);
              } else {
                console.error(
                  '서버로부터 받은 데이터가 배열이 아닙니다:',
                  data,
                );
              }
            })
            .catch((Error) => {
              if (Error.status === 400) {
                console.error('잘못된 요청입니다:', Error);
              } else if (Error.status === 405) {
                console.error('허용되지 않는 메서드입니다:', Error);
              } else if (Error.status === 500) {
                console.error('서버 오류가 발생했습니다:', Error);
              }
            });
        });
      });
    };

    script.onerror = () => {
      console.error('Failed to load Kakao Maps script.');
    };
  }, []);

  function addMarkers(map: any, storeData: StoreData[]) {
    console.log('addMarkers 함수 호출됨');
    console.log('storeData:', storeData);
    removeMarkers(); /* 기존 마커 제거 */

    if (!Array.isArray(storeData)) {
      console.error('storeData is not an array:', storeData);
      return;
    }

    /* storeData를 기반으로 마커 생성 및 지도에 추가 */
    const newMarkers = storeData.map((store) => {
      console.log('store 데이터:', store);
      const lat = store.posx;
      const lng = store.posy;

      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      console.log('markerPosition:', markerPosition);
      console.log(
        'markerPosition 위도:',
        markerPosition.getLat(),
        '경도:',
        markerPosition.getLng(),
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      console.log('marker 객체:', marker);

      marker.setMap(map); /* 마커를 지도에 추가 */
      console.log('마커 추가됨:', marker);

      const markerPos = marker.getPosition();
      console.log('마커 위치:', markerPos);
      console.log(
        '마커 위도:',
        markerPos.getLat(),
        '마커 경도:',
        markerPos.getLng(),
      );
      console.log('지도 중심:', map.getCenter());
      console.log('위도 (lat):', lat, '경도 (lng):', lng);
      /* 마커 클릭 이벤트 설정 */
      window.kakao.maps.event.addListener(marker, 'click', function () {
        trackMarkerPosition(map, marker);
      });

      return marker;
    });

    console.log('newMarkers 배열:', newMarkers);
    setMarkers(newMarkers); /* 상태에 새로운 마커 배열 설정 */
  }

  function removeMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  }

  function trackMarkerPosition(map: any, marker: any) {
    window.kakao.maps.event.addListener(map, 'center_changed', () => {
      const position = marker.getPosition();
      const bounds = map.getBounds();

      if (!bounds.contain(position)) {
        const projection = map.getProjection();
        const anchorPoint = projection.pointFromCoords(position);
        const newPoint = adjustPointToBounds(anchorPoint, bounds);
        const newPosition = projection.coordsFromPoint(newPoint);
        marker.setPosition(newPosition);
      }
    });
  }

  function adjustPointToBounds(point: { x: number; y: number }, bounds: any) {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    point.x = Math.max(sw.getLng(), Math.min(ne.getLng(), point.x));
    point.y = Math.max(sw.getLat(), Math.min(ne.getLat(), point.y));

    return point;
  }

  const handleButtonClick = async () => {
    if (!map) return;

    const res = await fetch(
      `https://api.wagubook.shop/map?left=${left}&right=${right}&up=${up}&down=${down}`,
      {
        credentials: 'include',
        method: 'GET',
      },
    );
    const data = await res.json();
    console.log(data);
    if (Array.isArray(data)) {
      addMarkers(map, data);
    } else {
      console.error('서버로부터 받은 데이터가 배열이 아닙니다:', data);
    }
  };

  return (
    <main className={s.container}>
      <div className={s.container}>
        <h1>지도</h1>
        <div
          id="map"
          style={{
            width: '315px',
            height: '315px',
            position: 'relative',
            zIndex: 0,
          }}
        ></div>
        <button className={s.btn} onClick={handleButtonClick}>
          서버로 좌표 전송
        </button>
      </div>
    </main>
  );
}
