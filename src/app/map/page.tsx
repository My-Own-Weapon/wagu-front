/* eslint-disable @typescript-eslint/no-explicit-any */ // for KakaoMap

'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import LiveFriends from '@/components/LiveFriendsList';
import VoteUrlModal from '@/components/VoteUrlModal';
import { StoreResponse } from '@/types';

import PostsOfMap from '@/app/map/_components/PostsOfMap';
import Heading from '@/components/ui/Heading';
import { BoxButton } from '@/components/ui';
import MapModel from '@/app/map/_lib/MapModel';
import { useBoundaryStores, useSelectedStoreInfo } from '@/hooks/domains';

import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}
export type KakaoMapElement = HTMLDivElement;
export type MapMarker = any;

export default function MapPage() {
  const mapModelRef = useRef<MapModel | null>(null);
  const { stores, setBoundary } = useBoundaryStores();
  const {
    selectedStore,
    setSelectedStore,
    storePosts,
    onLiveFollowingsAtStore,
  } = useSelectedStoreInfo();
  const [isModalOpen, toggleModalOpen] = useReducer((isOpen) => !isOpen, false);

  const onLoadMapRef = useCallback(
    (node: KakaoMapElement) => {
      if (!node) {
        mapModelRef.current?.cleanupScript();
        return;
      }

      const mapModel = new MapModel(node);
      mapModelRef.current = mapModel;
      mapModel.addEventListenerMap('idle', async () => {
        const boundary = mapModel.getUserMapBoundary();
        setBoundary(boundary);
      });
    },
    [setBoundary],
  );

  /**
   * ✅ TODO: 이전 움직임의 캐쉬된 위치 기반으로 움직이기 때문에
   *          아주 조금씩 움직움직여 많은거리를 이동해도 마커를 새로 불러오지않음
   */
  useEffect(() => {
    if (!mapModelRef.current) return;

    const handleClickMarker = (store: StoreResponse) => {
      setSelectedStore(store);
    };

    mapModelRef.current.createMarkers(stores, handleClickMarker);
  }, [stores, setSelectedStore]);

  return (
    <main className={s.container}>
      <div className={s.top}>
        <div id="map" className={s.map} ref={onLoadMapRef} />
      </div>
      <div className={s.bottom}>
        {selectedStore?.liveStore && selectedStore?.storeName && (
          <>
            <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
              {selectedStore.storeName}에서 방송중이에요 !
            </Heading>
            <LiveFriends liveFriends={onLiveFollowingsAtStore} />
          </>
        )}
        <PostsOfMap
          selectedStoreName={selectedStore?.storeName}
          selectedStoreId={selectedStore?.storeId}
          posts={storePosts}
        />
      </div>
      <div className={s.urlButtonContainer}>
        <BoxButton height="48px" styleType="fill" onClick={toggleModalOpen}>
          함께 투표 링크 생성
        </BoxButton>
      </div>
      <VoteUrlModal isOpen={isModalOpen} onRequestClose={toggleModalOpen} />
    </main>
  );
}
