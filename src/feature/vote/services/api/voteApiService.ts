import ApiService from '@/feature/_lib/ApiService';
import {
  DeletePathParams,
  DeleteQueryParams,
  DeleteResponses,
  GetPathParams,
  GetResponses,
  PatchPathParams,
  PatchQueryParams,
  PatchResponses,
  PostPathParams,
  PostQueryParams,
  PostResponses,
} from '@/feature/_types/openApiAccess';
import { z } from 'zod';

class VoteApiService extends ApiService {
  /**
   * @description 투표에 참여할 후보 가게 목록 조회
   */
  async fetchCandidateStores(
    sessionId: string,
  ): Promise<CandidateStoresSchema> {
    const url = sessionId; /* server query name */
    const res = await this.fetcher(`/share/${url}/vote/list`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return candidateStoresSchema.parse(data);
  }

  /**
   * @description 투표 결과에서 승리한 가게 목록 조회
   */
  async fetchVoteWinnerStores(
    sessionId: string,
  ): Promise<VoteWinnerStoresSchema> {
    const res = await this.fetcher(`/share/${sessionId}/result`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return voteWinnerStoresSchema.parse(data);
  }

  /**
   * @description vote 페이지에서 함께 투표하기 방 생성
   *
   * @usedBy vote modal
   */
  async createShareMapRandomSessionId(): Promise<VoteMapRandomSessionIdSchema> {
    const res = await this.fetcher(
      '/share',
      {
        method: 'POST',
        credentials: 'include',
      },
      {
        errorMessage: '함께 투표하기 방을 생성하는데 실패했습니다.',
      },
    );
    const sessionId = await res.text();

    return sessionId;
  }

  /**
   * @description vote page의 sessionId랑 매칭되는 session을 생성하고 live 시작
   *
   * @warning createShareMapRandomSessionId()과 같이 사용해야한다
   */
  async publishShareMapSession(
    sessionId: string,
  ): Promise<PublishShareMapSessionSchema> {
    const res = await this.fetcher(`/api/sessions/voice`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customSessionId: sessionId,
      }),
    });
    const data = await res.json();

    return publishShareMapSessionSchema.parse(data);
  }

  /**
   * @description 투표 후보자 목록에 추가
   */
  async addCandidateStore(
    sessionId: PostPathParams['/share/{url}']['url'],
    storeId: PostQueryParams['/share/{url}']['store_id'],
  ): Promise<AddCandidateStoreSchema> {
    const res = await this.fetcher(`/share/${sessionId}?store_id=${storeId}`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.text();

    return addCandidateStoreSchema.parse(data);
  }

  /**
   * @description 투표 후보자 목록에서 삭제
   */
  async removeCandidateStore(
    sessionId: DeletePathParams['/share/{url}']['url'],
    storeId: DeleteQueryParams['/share/{url}']['store_id'],
  ): Promise<RemoveCandidateStoreSchema> {
    const res = await this.fetcher(`/share/${sessionId}?store_id=${storeId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.text();

    return removeCandidateStoreSchema.parse(data);
  }

  /**
   * @description 진짜투표
   */
  async voteStore(
    sessionId: PostPathParams['/share/{url}/vote']['url'],
    storeId: PostQueryParams['/share/{url}/vote']['store_id'],
  ): Promise<VoteStoreSchema> {
    const res = await this.fetcher(
      `/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    const data = await res.text();

    return voteStoreSchema.parse(data);
  }

  /**
   * @description 후보자 목록에서 투표한 후보자 투표 취소
   */
  async cancelVoteStore(
    sessionId: PatchPathParams['/share/{url}/vote']['url'],
    storeId: PatchQueryParams['/share/{url}/vote']['store_id'],
  ): Promise<CancelVoteStoreSchema> {
    const res = await this.fetcher(
      `/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    );
    const data = await res.text();

    return cancelVoteStoreSchema.parse(data);
  }

  /**
   * @description 투표 참여자 수 조회
   */
  async fetchConnectionPeopleCount(
    sessionId: GetPathParams['/api/sessions/{sessionId}/connections']['sessionId'],
  ): Promise<ConnectionPeopleCountSchema> {
    const res = await this.fetcher(`/api/sessions/${sessionId}/connections`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.text();
    const count = Number(data);

    return connectionPeopleCountSchema.parse(count);
  }
}

const connectionPeopleCountSchema = z.number() satisfies z.ZodType<
  GetResponses['/api/sessions/{sessionId}/connections']
>;
export type ConnectionPeopleCountSchema = z.infer<
  typeof connectionPeopleCountSchema
>;

const cancelVoteStoreSchema = z.string() satisfies z.ZodType<
  PatchResponses['/share/{url}/vote']
>;
export type CancelVoteStoreSchema = z.infer<typeof cancelVoteStoreSchema>;

const voteStoreSchema = z.string() satisfies z.ZodType<
  PostResponses['/share/{url}/vote']
>;
export type VoteStoreSchema = z.infer<typeof voteStoreSchema>;

const addCandidateStoreSchema = z.string() satisfies z.ZodType<
  PostResponses['/share/{url}']
>;
export type AddCandidateStoreSchema = z.infer<typeof addCandidateStoreSchema>;

const removeCandidateStoreSchema = z.string() satisfies z.ZodType<
  DeleteResponses['/share/{url}']
>;
export type RemoveCandidateStoreSchema = z.infer<
  typeof removeCandidateStoreSchema
>;

const publishShareMapSessionSchema = z.object({
  memberId: z.number(),
  sessionId: z.string(),
}) satisfies z.ZodType<{
  memberId: number;
  sessionId: string;
}>;
export type PublishShareMapSessionSchema = z.infer<
  typeof publishShareMapSessionSchema
>;

const voteWinnerStoresSchema = z.array(
  z.object({
    storeId: z.number(),
    storeName: z.string(),
    menuImage: z.object({
      id: z.number(),
      url: z.string(),
    }),
    postCount: z.number(),
    menuName: z.string(),
  }),
) satisfies z.ZodType<
  Array<Required<GetResponses['/share/{url}/result'][number]>>
>;
export type VoteWinnerStoresSchema = z.infer<typeof voteWinnerStoresSchema>;

const candidateStoresSchema = z.array(
  z.object({
    storeId: z.number(),
    storeName: z.string(),
    menuImage: z.object({
      id: z.number(),
      url: z.string(),
    }),
    postCount: z.number(),
    menuName: z.string(),
  }),
) satisfies z.ZodType<OpenApiFetchCandidateStoresResponse>;
type OpenApiFetchCandidateStoresResponse = Array<
  Required<GetResponses['/share/{url}/vote/list'][number]>
>;
export type CandidateStoresSchema = z.infer<typeof candidateStoresSchema>;

const voteMapRandomSessionIdSchema = z.string() satisfies z.ZodType<
  PostResponses['/share']
>;
export type VoteMapRandomSessionIdSchema = z.infer<
  typeof voteMapRandomSessionIdSchema
>;

export const voteApiService = new VoteApiService();
