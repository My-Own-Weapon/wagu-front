import ApiService from '@/feature/_lib/ApiService';
import { GetResponses } from '@/feature/_types/openApiAccess';
import { z } from 'zod';

class VoteApiService extends ApiService {
  async fetchCandidateStores(
    sessionId: string,
  ): Promise<FetchCandidateStoresResponse> {
    const url = sessionId; /* server query name */
    const res = await super.fetcher(`/share/${url}/vote/list`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return fetchCandidateStores.parse(data);
  }

  async fetchVoteWinnerStores(sessionId: string) {
    const res = await this.fetcher(`/share/${sessionId}/result`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return fetchVoteWinnerStores.parse(data);
  }
}

type FetchVoteWinnerStoresResponse = Array<
  Required<GetResponses['/share/{url}/result'][number]>
>;
const fetchVoteWinnerStores = z.array(
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
) satisfies z.ZodType<FetchVoteWinnerStoresResponse>;

const fetchCandidateStores = z.array(
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
export type FetchCandidateStoresResponse = z.infer<typeof fetchCandidateStores>;

export const voteApiService = new VoteApiService();
