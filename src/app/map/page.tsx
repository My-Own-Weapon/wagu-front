/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/components/Post';
import LiveFriends from '@/components/LiveFriendsList';
import VoteUrlModal from '@/components/VoteUrlModal';
import { MapVertexes, PostCardProps } from '@/types';
import { apiService } from '@/services/apiService';

import s from './page.module.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

interface StoreData {
  name: string;
  address: string;
  storeId: number;
  posx: number;
  posy: number;
}

interface Streamer {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
}
export default function KakaoMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
            37.297379834634675,
            127.03869108937842,
          ),
          level: 3,
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

  const addMarkers = (mapInstance: any, stores: StoreData[]) => {
    removeMarkers();

    const newMarkers = stores.map((store) => {
      const { kakao } = window;
      const imageSrc = '/images/map/ping_orange.svg';
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

  const createShareMapUrl = async () => {
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
      <div className={s.mapContainer}>
        <div id="map" className={s.map} />
      </div>
      <div>
        <LiveFriends liveFriends={streamers} />
        <div className={s.postContainer}>
          <Post.Wrapper>
            <Post>
              {posts.length === 0 ? (
                <Post.Title title="Post를 선택해보세요!" />
              ) : (
                <Post.Title title={`${posts[0].storeName}  Posts`} />
              )}
              {posts.length > 0 && <Post.PostCards posts={posts} />}
            </Post>
          </Post.Wrapper>
        </div>
      </div>
      <div className={s.urlContainer}>
        <button
          className={s.createUrlButton}
          type="button"
          onClick={createShareMapUrl}
        >
          투표 URL 생성하기
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
