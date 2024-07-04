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
          const message = 'Geolocation을 사용할 수 없어요..';

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
          });

          map.setCenter(locPosition);
        }
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
