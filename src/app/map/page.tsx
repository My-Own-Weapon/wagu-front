'use client';

import s from './page.module.scss';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
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

        // 지도에 idle 이벤트 등록
        window.kakao.maps.event.addListener(map, 'idle', function () {
          const bounds = map.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          console.log('현재 지도 범위 좌하단: ' + swLatLng.toString());
          console.log('현재 지도 범위 우상단: ' + neLatLng.toString());

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

          // 서버로 좌표 전송
          fetch(`/map?left=${left}&right=${right}&up=${up}&down=${down}`)
            .then((response) => {
              if (!response.ok) {
                throw response;
              }
              return response.json();
            })
            .then((data) => {
              console.log('서버로부터 받은 데이터:', data);
            })
            .catch((error) => {
              if (error.status === 400) {
                console.error('잘못된 요청입니다:', error);
              } else if (error.status === 405) {
                console.error('허용되지 않는 메서드입니다:', error);
              } else if (error.status === 500) {
                console.error('서버 오류가 발생했습니다:', error);
              } else {
                console.error('서버 요청 중 오류 발생:', error);
              }
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

        <button
          className={s.btn}
          onClick={async () => {
            const res = await fetch(
              `http://3.39.118.22:8080/map?left=${left}&right=${right}&up=${up}&down=${down}`,
              {
                method: 'GET',
              },
            );
            const data = await res.json();
            console.log(data);
          }}
        ></button>
      </div>
    </main>
  );
};

export default KakaoMap;
