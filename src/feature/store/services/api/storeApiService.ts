/* eslint-disable camelcase */

import ApiService from '@/feature/_lib/ApiService';
import {
  GetPathParams,
  GetQueryParams,
  GetResonsesWithRequired,
  GetResponses,
  QueryParams,
} from '@/feature/_types/openApiAccess';
import { z } from 'zod';
import { PickNullable } from '@/types';

class StoreApiService extends ApiService {
  /**
   * @description 가게 상세 정보 조회
   *
   * @returns 가게 상세 정보
   */
  async fetchStoreDetails(
    storeId: GetPathParams['/store/{store_id}']['store_id'],
  ): Promise<StoreDetailsResponse> {
    const res = await this.fetcher(`/store/${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return storeDetailsResponse.parse(data);
  }

  /**
   * @description 가게 이름으로 검색
   *
   * @returns 검색된 가게 목록
   */
  async searchStore({
    keyword,
    page,
    size,
  }: GetQueryParams['/stores']): Promise<SearchStoreResponse> {
    const res = await this.fetcher(
      `/stores?keyword=${keyword}&page=${page}&size=${size}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await res.json();

    return searchStoreResponse.parse(data);
  }

  /**
   * @description 지도 범위 내의 가게 목록 조회
   *
   * @returns 지도 범위 내 가게 목록
   */
  async fetchMapBoundaryStores({
    left,
    right,
    up,
    down,
  }: QueryParams<'get'>['/map']): Promise<MapBoundaryStoresResponse> {
    const res = await this.fetcher(
      `/map?left=${left}&right=${right}&up=${up}&down=${down}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await res.json();

    return mapBoundaryStoresResponse.parse(data);
  }

  /**
   * @description 카카오 지도 API를 통한 가게 정보 검색
   *
   * @returns 카카오 검색 결과
   */
  async fetchKAKAOStoreInfo({
    name,
    page = 1,
    size = 15,
  }: {
    name: string;
    page?: number;
    size?: number;
  }): Promise<KakaoStoreInfoResponse> {
    const basePath = '/local/search/keyword.json';
    const queryString = `?page=${page}&size=${size}&sort=accuracy&query=${encodeURIComponent(name)}`;

    const res = await this.fetcher(
      `${basePath}${queryString}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      },
      {
        url: 'https://dapi.kakao.com/v2',
      },
    );
    const data = await res.json();

    return kakaoStoreInfoResponse.parse(data);
  }
}

const storeDetailsResponse = z.object({
  storeId: z.number(),
  storeName: z.string(),
  menuImage: z.object({
    id: z.number().nullable(),
    url: z.string().nullable(),
  }),
  postCount: z.number(),
  menuName: z.string(),
}) satisfies z.ZodType<
  Omit<Required<GetResponses['/store/{store_id}']>, 'menuImage'> & {
    menuImage: PickNullable<
      Required<Required<GetResponses['/store/{store_id}']>['menuImage']>,
      'url' | 'id'
    >;
  }
>;
type StoreDetailsResponse = z.infer<typeof storeDetailsResponse>;

const searchStoreResponse = z.array(
  z.object({
    storeId: z.number(),
    storeName: z.string(),
    menuImage: z.object({
      id: z.number().nullable(),
      url: z.string().nullable(),
    }),
    postCount: z.number(),
    menuName: z.string(),
  }),
) satisfies z.ZodType<
  Array<
    Omit<GetResonsesWithRequired['/stores'][number], 'menuImage'> & {
      menuImage: PickNullable<
        GetResonsesWithRequired['/stores'][number]['menuImage'],
        'url' | 'id'
      >;
    }
  >
>;
type SearchStoreResponse = z.infer<typeof searchStoreResponse>;

const mapBoundaryStoresResponse = z.array(
  z.object({
    storeId: z.number(),
    storeName: z.string(),
    storeAddress: z.string(),
    posx: z.number(),
    posy: z.number(),
    liveStore: z.boolean(),
  }),
) satisfies z.ZodType<GetResonsesWithRequired['/map']>;
type MapBoundaryStoresResponse = z.infer<typeof mapBoundaryStoresResponse>;

const kakaoStoreInfoResponse = z.any();
type KakaoStoreInfoResponse = z.infer<typeof kakaoStoreInfoResponse>;

export const storeApiService = new StoreApiService();
