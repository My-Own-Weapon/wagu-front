/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import LiveFriends from '@/components/LiveFriendsList';
import VoteUrlModal from '@/components/VoteUrlModal';
import { PostOfStoreResponse, StoreResponse } from '@/types';
import { apiService } from '@/services/apiService';

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

interface Streamer {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
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
    (kakaoMapElement: KakaoMapElement) => {
      if (!kakaoMapElement) {
        const $garbageScript = document.head.querySelector(
          'script[src*="https://dapi.kakao.com/v2/maps/sdk"]',
        ) as HTMLScriptElement;
        if (Boolean($garbageScript)) {
          document.head.removeChild($garbageScript);
        }

        return;
      }

      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          if (!kakaoMapElement) {
            alert(
              'document.getElementById("map") 지도 컨테이너를 찾을 수 없습니다.',
            );
            return;
          }

          const mapModel = new MapModel(kakaoMapElement);
          mapModelRef.current = mapModel;

          mapModel.addEventListenerMap('idle', async () => {
            const mapBounds = mapModel.kakaoMapInstance.getBounds();
            const SWaxis = mapBounds.getSouthWest();
            const NEaxis = mapBounds.getNorthEast();
            const boundary = {
              left: SWaxis.getLng(),
              down: SWaxis.getLat(),
              right: NEaxis.getLng(),
              up: NEaxis.getLat(),
            };

            setBoundary(boundary);
          });

          /* 업데이트가 안됨 */
          mapModelRef.current?.createMarkers(stores, (store: StoreResponse) => {
            setSelectedStore(store);
          });
        });
      };

      script.onerror = () => {
        alert('카카오 지도 스크립트를 불러오지 못했습니다.');
      };
    },
    [setBoundary],
  );

  // useEffect(() => {
  //   if (!mapModelRef.current) return;
  // }, [stores]);

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
