'use client';

import { useEffect, useState } from 'react';
import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
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
      console.log('Kakao Maps script loaded.');
      window.kakao.maps.load(() => {
        console.log('Kakao Maps API loaded.');

        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(
            37.3000665143311,
            127.03347594765566,
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerPosition1 = new window.kakao.maps.LatLng(
          37.3000665143311,
          127.03347594765566,
        );
        const markerPosition2 = new window.kakao.maps.LatLng(
          37.3010665143314,
          127.03447594765588,
        );

        const customMarkerImageUrl = '/OrangeMarker.svg';
        const customMarkerImageSize = new window.kakao.maps.Size(24, 35);
        const customMarkerImageOptions = {
          offset: new window.kakao.maps.Point(12, 35),
        };
        const customMarkerImage = new window.kakao.maps.MarkerImage(
          customMarkerImageUrl,
          customMarkerImageSize,
          customMarkerImageOptions,
        );

        const markers = [
          new window.kakao.maps.Marker({
            position: markerPosition1,
            image: customMarkerImage,
          }),
          new window.kakao.maps.Marker({
            position: markerPosition2,
            image: customMarkerImage,
          }),
        ];

        markers.forEach((marker) => marker.setMap(map));

        window.kakao.maps.event.addListener(map, 'center_changed', () => {
          markers.forEach((marker) => {
            const position = marker.getPosition();
            const bounds = map.getBounds();

            if (!bounds.contain(position)) {
              const projection = map.getProjection();
              const anchorPoint = projection.pointFromCoords(position);
              // const newPoint = adjustPointToBounds(anchorPoint, bounds);
              // const newPosition = projection.coordsFromPoint(newPoint);
              // marker.setPosition(newPosition);
            }
          });
        });

        // function adjustPointToBounds(point, bounds) {
        //   const minPoint = bounds.getMin();
        //   const maxPoint = bounds.getMax();

        //   point.x = Math.max(minPoint.x, Math.min(maxPoint.x, point.x));
        //   point.y = Math.max(minPoint.y, Math.min(maxPoint.y, point.y));

        //   return point;
        // }

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
                credentials: 'include',
                method: 'GET',
              },
            );
            const data = await res.json();
            console.log(data);
          }}
        >
          서버로 좌표 전송
        </button>
      </div>
    </main>
  );
}
