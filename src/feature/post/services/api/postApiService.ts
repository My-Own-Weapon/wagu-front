import { z } from 'zod';

import ApiService from '@/feature/_lib/ApiService';
import { GetResponses } from '@/feature/_types/openApiAccess';
import { PickNullable } from '@/types';

class PostApiService extends ApiService {
  async fetchStorePosts({
    storeId,
    page = 0,
    count = 12,
  }: FetchStorePostsParams): Promise<FetchStorePostsResponse> {
    const res = await this.fetcher(
      `/map/posts?storeId=${storeId}&page=${page}&size=${count}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await res.json();

    return fetchStorePostsResponse.parse(data);
  }
}

interface FetchStorePostsParams {
  storeId: number;
  page?: number;
  count?: number;
}

const fetchStorePostsResponse = z.array(
  z.object({
    postId: z.number(),
    memberUsername: z.string(),
    storeName: z.string(),
    postMainMenu: z.string(),
    menuImage: z.object({
      id: z.number(),
      url: z.string(),
    }),
    menuPrice: z.number(),
    createdDate: z.string(),
    updatedDate: z.string().nullable(),
    category: z.enum([
      'KOREAN',
      'CHINESE',
      'JAPANESE',
      'WESTERN',
      'DESSERT',
      'CAFE',
    ]),
  }),
) satisfies z.ZodType<
  Array<
    PickNullable<Required<GetResponses['/map/posts'][number]>, 'updatedDate'>
  >
>;
export type FetchStorePostsResponse = z.infer<typeof fetchStorePostsResponse>;

export const postApiService = new PostApiService();
