/* eslint-disable @typescript-eslint/no-explicit-any */

import type { KakaoMapElement, MapMarker } from '@/app/map/page';
import type { StoreResponse } from '@/types';

export default class MapModel {
  private readonly $map: HTMLDivElement;

  public kakaoMapInstance: any;

  private markers: MapMarker[];

  constructor($map: KakaoMapElement) {
    this.$map = $map;
    this.kakaoMapInstance = null;
    this.markers = [];

    this.init();
  }

  private init() {
    // const script = document.createElement('script');
    // script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
    // script.async = true;
    // document.head.appendChild(script);

    // script.onload = () => {
    //   window.kakao.maps.load(() => {
    // if (!this.$map) {
    //   alert('document.getElementById("map") 지도 컨테이너를 찾을 수 없습니다.');
    //   return;
    // }

    const options = {
      center: new window.kakao.maps.LatLng(37.5035685391056, 127.0416472341673),
      level: 5,
    };

    this.kakaoMapInstance = new window.kakao.maps.Map(this.$map, options);
    //   });
    // };

    // script.onerror = () => {
    //   alert('카카오 지도 스크립트를 불러오지 못했습니다.');
    // };
  }

  removePrevMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  createMarkers(
    stores: StoreResponse[],
    listner: (store: StoreResponse) => void,
  ) {
    this.removePrevMarkers();
    const { maps } = window.kakao;

    stores?.forEach((store) => {
      const { liveStore } = store;
      const imageSrc = liveStore
        ? '/newDesign/map/pin_book_live.svg'
        : '/newDesign/map/pin_book.svg';
      const imageSize = new maps.Size(32, 32);
      const imageOption = { offset: new maps.Point(16, 32) };
      const markerImage = new maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );
      const markerPosition = new maps.LatLng(store.posy, store.posx);
      const marker = new maps.Marker({
        position: markerPosition,
        key: store.storeId,
        image: markerImage,
      });

      this.markers.push(marker);
      marker.setMap(this.kakaoMapInstance);
      this.addEventListnerMarker(marker, 'click', () => {
        listner(store);
      });
    });
  }

  addEventListenerMap(event: string, cb: () => void) {
    if (!window.kakao) return;

    window.kakao.maps.event.addListener(this.kakaoMapInstance, event, cb);
  }

  // eslint-disable-next-line class-methods-use-this
  addEventListnerMarker(marker: any, event: string, cb: () => void) {
    if (!window.kakao) return;

    window.kakao.maps.event.addListener(marker, event, cb);
  }
}
