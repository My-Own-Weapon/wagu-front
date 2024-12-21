import { z } from 'zod';

import ApiService from '@/feature/_lib/ApiService';
import {
  GetResponses,
  DeleteResponses,
  GetQueryParams,
  PostPathParams,
  GetPathParams,
  DeletePathParams,
} from '@/feature/_types/openApiAccess';
import { PickNullable } from '@/types';

class LiveApiService extends ApiService {
  /**
   * @description 가게 안에서 라이브중인 following 목록 조회
   *
   * @returns {array} 가게 안에서 라이브중인 following 목록
   */
  async fetchOnLiveFollowingsAtStore(
    storeId: GetQueryParams['/map/live']['storeId'],
  ): Promise<OnLiveFollowingsAtStoreSchema> {
    const res = await this.fetcher(`/map/live?storeId=${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return onLiveFollowingsAtStoreSchema.parse(data);
  }

  /**
   * @description following중 live하고 있는 following 목록 조회
   *
   * @returns {array} live 중인 following 목록
   */
  async fetchLiveFollowings(): Promise<OnLiveFollowingsSchema> {
    const res = await this.fetcher(`/rooms/followings`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return onLiveFollowingsSchema.parse(data);
  }

  /**
   * @description 위치기반 참가할 라이브 세션 id 생성
   */
  async createSessionId({
    storeName,
    address,
    posx,
    posy,
  }: {
    storeName: string;
    address: string;
    posx: number;
    posy: number;
  }): Promise<CreateSessionSchema> {
    const res = await this.fetcher(`/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeLocation: {
          address,
          posx,
          posy,
        },
        storeName,
      }),
      credentials: 'include',
    });
    const data = await res.json();

    return createSessionSchema.parse(data);
  }

  /**
   * @description 라이브 세션에 참가하기 위한 스트리밍 토큰 조회
   */
  async fetchStreamingToken(
    sessionId: PostPathParams['/api/sessions/{sessionId}/connections']['sessionId'],
  ): Promise<StreamingTokenSchema> {
    const res = await this.fetcher(`/api/sessions/${sessionId}/connections`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();

    return streamingTokenSchema.parse(data);
  }

  /**
   * @description 라이브 세션 생성자 조회
   */
  async checkIsStreamerUserOfSession(
    sessionId: GetPathParams['/api/sessions/{sessionId}/creator']['sessionId'],
  ): Promise<SessionCreatorSchema> {
    const res = await this.fetcher(`/api/sessions/${sessionId}/creator`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return sessionCreatorSchema.parse(data);
  }

  /**
   * @description 라이브 세션 종료
   */
  async removeLiveSession(
    sessionId: DeletePathParams['/api/sessions/{sessionId}']['sessionId'],
  ): Promise<DeleteSessionSchema> {
    const res = await this.fetcher(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.text();

    return deleteSessionSchema.parse(data);
  }
}

const onLiveFollowingsAtStoreSchema = z.array(
  z.object({
    profileImage: z.string(),
    userName: z.string(),
    address: z.string(),
    storeName: z.string(),
    sessionId: z.string(),
  }),
) satisfies z.ZodType<Array<Required<GetResponses['/map/live'][number]>>>;
export type OnLiveFollowingsAtStoreSchema = z.infer<
  typeof onLiveFollowingsAtStoreSchema
>;

const createSessionSchema = z.object({
  sessionId: z.string(),
}) satisfies z.ZodType<{
  sessionId: string;
}>;
export type CreateSessionSchema = z.infer<typeof createSessionSchema>;

const streamingTokenSchema = z.object({
  token: z.string(),
}) satisfies z.ZodType<{
  token: string;
}>;
export type StreamingTokenSchema = z.infer<typeof streamingTokenSchema>;

const sessionCreatorSchema = z.object({
  memberId: z.number(),
  username: z.string(),
}) satisfies z.ZodType<{
  memberId: number;
  username: string;
}>;
export type SessionCreatorSchema = z.infer<typeof sessionCreatorSchema>;

const deleteSessionSchema = z.string() satisfies z.ZodType<
  DeleteResponses['/api/sessions/{sessionId}']
>;
export type DeleteSessionSchema = z.infer<typeof deleteSessionSchema>;

const onLiveFollowingsSchema = z.array(
  z.object({
    profileImage: z.string().nullable(),
    sessionId: z.string(),
    userName: z.string(),
    address: z.string(),
    storeName: z.string(),
  }),
) satisfies z.ZodType<
  Array<
    PickNullable<
      Required<GetResponses['/rooms/followings'][number]>,
      'profileImage'
    >
  >
>;
export type OnLiveFollowingsSchema = z.infer<typeof onLiveFollowingsSchema>;

export const liveApiService = new LiveApiService();
