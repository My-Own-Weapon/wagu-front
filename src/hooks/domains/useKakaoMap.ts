import { useCallback, useRef } from 'react';

import MapModel from '@/lib/MapModel';
import { MapVertexes, StoreResponse } from '@/types';
import { createElementWithAttr, elementsAppendChild } from '@/utils';

const useKakaoMap = (onChangeBoundary: (boundary: MapVertexes) => void) => {
  const mapModelRef = useRef<MapModel | null>(null);

  const onLoadMapRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        if (mapModelRef.current) mapModelRef.current.cleanupScript();

        return;
      }

      const mapModel = new MapModel(node);
      mapModelRef.current = mapModel;
      mapModel.addEventListenerMap('idle', async () => {
        const newBoundary = mapModel.getUserMapBoundary();
        onChangeBoundary(newBoundary);
      });
    },
    [onChangeBoundary],
  );

  const createMarkers = useCallback(
    (
      stores: StoreResponse[],
      handleClickMarker: (store: StoreResponse) => void,
    ) => {
      if (!mapModelRef.current) return;
      mapModelRef.current.createMarkers(stores, handleClickMarker);
    },
    [],
  );

  const createCustomImageMarker = (
    imageSrc: string,
    lat: number,
    lng: number,
  ) => {
    const $userMarker = createElementWithAttr('div', {
      style: {
        width: '40px',
        height: '40px',
        overflow: 'hidden',
        borderRadius: '50%',
        border: '2px solid #ff9900',
        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease-out',
      },
    });
    const $userMarkerImg = createElementWithAttr('img', {
      src: imageSrc,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    });

    elementsAppendChild($userMarkerImg, $userMarker);
    $userMarker.addEventListener('click', () => {
      const movePosition = new window.kakao.maps.LatLng(lat, lng);
      mapModelRef.current?.kakaoMapInstance.panTo(movePosition);
    });

    return $userMarker;
  };

  return { onLoadMapRef, createMarkers, mapModelRef, createCustomImageMarker };
};

export default useKakaoMap;
