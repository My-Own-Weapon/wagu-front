/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import LiveFriends from '@/components/LiveFriendsList';
import VoteUrlModal from '@/components/VoteUrlModal';
import { MapVertexes, PostOfStoreResponse, StoreResponse } from '@/types';
import { apiService } from '@/services/apiService';

import PostsOfMap from '@/app/map/_components/PostsOfMap';
import Heading from '@/components/ui/Heading';

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

export default function MapPage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<PostOfStoreResponse[]>([]);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(
    null,
  );
  const [voteUrl, setVoteUrl] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) {
          alert(
            'document.getElementById("map") 지도 컨테이너를 찾을 수 없습니다.',
          );
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(
            37.5035685391056,
            127.0416472341673,
          ),
          level: 5,
        };

        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);

        window.kakao.maps.event.addListener(mapInstance, 'idle', () => {
          const mapBounds = mapInstance.getBounds();
          const swLatLng = mapBounds.getSouthWest();
          const neLatLng = mapBounds.getNorthEast();

          fetchStoresOfMapBoundary(mapInstance, {
            left: swLatLng.getLng(),
            down: swLatLng.getLat(),
            right: neLatLng.getLng(),
            up: neLatLng.getLat(),
          });
        });
      });
    };

    script.onerror = () => {
      alert('카카오 지도 스크립트를 불러오지 못했습니다.');
    };
  }, []);

  const fetchStoresOfMapBoundary = async (
    mapInstance: any,
    bounds: MapVertexes,
  ) => {
    const stores = await apiService.fetchStoresOfMapBoundary(bounds);

    addMarkers(mapInstance, stores);
  };

  const addMarkers = (mapInstance: any, stores: StoreResponse[]) => {
    removeMarkers();

    const { kakao } = window;

    const newMarkers = stores.map((store) => {
      const { liveStore } = store;
      const imageSrc = liveStore
        ? '/newDesign/map/pin_book_live.svg'
        : '/newDesign/map/pin_book.svg';
      const imageSize = new kakao.maps.Size(32, 32);
      const imageOption = { offset: new kakao.maps.Point(16, 32) };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );
      const markerPosition = new kakao.maps.LatLng(store.posy, store.posx);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        key: store.storeId,
        image: markerImage,
      });

      marker.setMap(mapInstance);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        fetchStreamers(store.storeId);
        fetchPosts(store.storeId);
        setSelectedStore(store);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));

    setMarkers([]);
  };

  const fetchStreamers = async (storeId: number) => {
    const liveOnStreamers =
      await apiService.fetchLiveOnStreamersOfStore(storeId);

    setStreamers(liveOnStreamers);
  };

  const fetchPosts = async (storeId: number) => {
    const posts = await apiService.fetchPostsOfStore(storeId);

    setPosts(posts);
  };

  const getShareUrl = async () => {
    const BASE_URL =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://www.wagubook.shop';
    const sessionId = await apiService.createShareMapRandomSessionId();
    apiService.publishShareMapSession(sessionId);

    setVoteUrl(`${BASE_URL}/share?sessionId=${sessionId}`);
    setModalIsOpen(true);
  };

  return (
    <main className={s.container}>
      <div className={s.top}>
        <div id="map" className={s.map} />
      </div>
      <div className={s.bottom}>
        {selectedStore?.liveStore && selectedStore?.storeName && (
          <>
            <Heading
              as="h3"
              fontSize="16px"
              fontWeight="bold"
              color="black"
              title={`${selectedStore.storeName}에서 방송중이에요 !`}
            />
            <LiveFriends liveFriends={streamers} />
          </>
        )}
        <PostsOfMap
          selectedStoreName={selectedStore?.storeName}
          selectedStoreId={selectedStore?.storeId}
          posts={posts}
        />
      </div>
      <div className={s.urlButtonContainer}>
        <button
          className={s.createUrlButton}
          type="button"
          onClick={getShareUrl}
        >
          함께 투표 링크 생성
        </button>
      </div>
      <VoteUrlModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        voteUrl={voteUrl}
      />
    </main>
  );
}
