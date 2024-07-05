'use client';
import s from './page.module.scss';
import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new window.kakao.maps.LatLng(lat, lon);

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: locPosition,
            });

            map.setCenter(locPosition);
          });
        } else {
          const locPosition = new window.kakao.maps.LatLng(
            33.450701,
            126.570667,
          );
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
          });

          map.setCenter(locPosition);
        }

        // 지도에 idle 이벤트 등록
        window.kakao.maps.event.addListener(map, 'idle', function () {
          const bounds = map.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          console.log('현재 지도 범위 좌하단: ' + swLatLng.toString());
          console.log('현재 지도 범위 우상단: ' + neLatLng.toString());

          const left = swLatLng.getLat();
          const down = swLatLng.getLng();
          const right = neLatLng.getLat();
          const up = neLatLng.getLng();

          console.log(
            `left: ${left}, down: ${down}, right: ${right}, up: ${up}`,
          );
          // 서버로 좌표 전송
          fetch(`/map?left=${left}&right=${right}&up=${up}&down=${down}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('서버로부터 받은 데이터:', data);
            })
            .catch((error) => {
              console.error('서버 요청 중 오류 발생:', error);
            });
        });
      });
    };
  }, []);

  return (
    <main className={s.container}>
      <div>
        <h1>지도</h1>
        <div id="map" style={{ width: '329px', height: '315px' }}></div>
      </div>
    </main>
  );
};

export default KakaoMap;
