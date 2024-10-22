import { useCallback, useRef } from 'react';

import MapModel from '@/lib/MapModel';
import { MapVertexes, StoreResponse } from '@/types';

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

  return { onLoadMapRef, createMarkers, mapModelRef };
};

export default useKakaoMap;
