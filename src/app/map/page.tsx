'use client';

import { useEffect, useReducer } from 'react';
import OnLiveFollowings from '@/components/LiveFriendsList';
import VoteUrlModal from '@/components/VoteUrlModal';
import { StoreResponse } from '@/types';

import PostsOfMap from '@/app/map/_components/PostsOfMap';
import { BoxButton, Heading } from '@/components/ui';
import {
  useBoundaryStores,
  useKakaoMap,
  useSelectedStoreInfo,
} from '@/hooks/domains';
import { Map } from '@/components/domain';

import s from './page.module.scss';

export default function MapPage() {
  const { stores, setBoundary } = useBoundaryStores();
  const { onLoadMapRef, createMarkers } = useKakaoMap(setBoundary);
  const {
    selectedStore,
    setSelectedStore,
    storePosts,
    onLiveFollowingsAtStore,
  } = useSelectedStoreInfo();
  const [isModalOpen, toggleModalOpen] = useReducer((isOpen) => !isOpen, false);

  /**
   * ✅ TODO: 이전 움직임의 캐쉬된 위치 기반으로 움직이기 때문에
   *          아주 조금씩 움직움직여 많은거리를 이동해도 마커를 새로 불러오지않음
   */
  useEffect(() => {
    // if (!mapModelRef.current) return;

    const handleClickMarker = (store: StoreResponse) => {
      setSelectedStore(store);
    };

    createMarkers(stores, handleClickMarker);
  }, [stores, setSelectedStore, createMarkers]);

  return (
    <main className={s.container}>
      <div className={s.top}>
        <Map className={s.map} mountRefCallback={onLoadMapRef} />
      </div>
      <div className={s.bottom}>
        {!selectedStore ? (
          <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
            지도의 가게를 클릭해보세요 !
          </Heading>
        ) : (
          <>
            {selectedStore.liveStore && (
              <>
                <Heading
                  as="h3"
                  fontSize="16px"
                  fontWeight="bold"
                  color="black"
                >
                  {selectedStore.storeName}에서 방송중이에요 !
                </Heading>
                <OnLiveFollowings liveFriends={onLiveFollowingsAtStore} />
              </>
            )}
            <PostsOfMap
              selectedStoreName={selectedStore?.storeName}
              selectedStoreId={selectedStore?.storeId}
              posts={storePosts}
            />
          </>
        )}
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
