/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { KakaoMapElement, MapMarker, StoreResponse } from '@/types';
import {
  $,
  createElementWithAttr,
  elementsAppendChild,
  removeChild,
} from '@/utils';

export default class MapModel {
  private SCRIPT_SRC = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=948985235eb596e79f570535fd01a71e&autoload=false&libraries=services`;
  private readonly $map: HTMLDivElement;
  public kakaoMapInstance: any;
  private markers: MapMarker[];
  private initPromise: Promise<void>;

  constructor($map: KakaoMapElement) {
    this.$map = $map;
    this.kakaoMapInstance = null;
    this.markers = [];

    this.initPromise = this.init();
  }

  private init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const $script = createElementWithAttr('script', {
        src: this.SCRIPT_SRC,
        async: true,
      });
      elementsAppendChild($script, document.head);

      $script.onload = () => {
        window.kakao.maps.load(() => {
          if (!this.$map) {
            reject(new Error('지도 컨테이너를 찾을 수 없습니다.'));
            return;
          }

          const options = {
            center: new window.kakao.maps.LatLng(
              37.5035685391056,
              127.0416472341673,
            ),
            level: 5,
          };

          this.kakaoMapInstance = new window.kakao.maps.Map(this.$map, options);

          /* 맵이 로드되고 움직임이 있어야 본인의 프로필이 보이기 때문 */
          setTimeout(() => {
            this.kakaoMapInstance.panTo(
              new window.kakao.maps.LatLng(37.5035585179056, 127.04164711416),
            );

            setTimeout(() => {
              this.kakaoMapInstance.panTo(
                new window.kakao.maps.LatLng(
                  37.5035685391056,
                  127.0416472341673,
                ),
              );
            }, 300);
          }, 500);
          resolve();
        });
      };

      $script.onerror = () => {
        reject(new Error('카카오 지도 스크립트를 불러오지 못했습니다.'));
      };
    });
  }

  async createMarkers(
    stores: StoreResponse[],
    listner: (store: StoreResponse) => void,
  ) {
    await this.initPromise;

    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao maps is not loaded');
      return;
    }

    this.removePrevMarkers();
    this.markers = stores.map((store) => {
      const marker = this.createMarker(store);
      this.addEventListnerMarker(marker, 'click', () => {
        listner(store);
      });

      return marker;
    });

    this.markers.forEach((marker) => marker.setMap(this.kakaoMapInstance));
  }

  private removePrevMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  private createMarker(store: StoreResponse) {
    const { liveStore } = store;
    const imageSrc = liveStore
      ? '/newDesign/map/pin_book_live.svg'
      : '/newDesign/map/pin_book.svg';
    const imageSize = new window.kakao.maps.Size(32, 32);
    const imageOption = { offset: new window.kakao.maps.Point(16, 32) };
    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption,
    );
    const markerPosition = new window.kakao.maps.LatLng(store.posy, store.posx);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      key: store.storeId,
      image: markerImage,
    });

    return marker;
  }

  async addEventListenerMap(event: string, cb: () => void) {
    await this.initPromise;

    if (!window.kakao) return;

    window.kakao.maps.event.addListener(this.kakaoMapInstance, event, cb);
  }

  // eslint-disable-next-line class-methods-use-this
  addEventListnerMarker(marker: any, event: string, cb: () => void) {
    if (!window.kakao) return;

    window.kakao.maps.event.addListener(marker, event, cb);
  }

  getUserMapBoundary() {
    const mapBounds = this.kakaoMapInstance.getBounds();
    const SWaxis = mapBounds.getSouthWest();
    const NEaxis = mapBounds.getNorthEast();
    return {
      left: SWaxis.getLng(),
      down: SWaxis.getLat(),
      right: NEaxis.getLng(),
      up: NEaxis.getLat(),
    };
  }

  cleanupScript() {
    const $garbageScript = $(
      'script[src*="https://dapi.kakao.com/v2/maps/sdk"]',
    ) as HTMLScriptElement;
    if (Boolean($garbageScript)) {
      removeChild($garbageScript, document.head);
    }
  }
}
