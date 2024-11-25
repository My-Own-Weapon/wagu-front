import ApiService from '@/feature/_lib/ApiService';
import {
  GetPathParams,
  GetQueryParams,
  GetResponses,
  PostParameters,
  PostResponses,
} from '@/feature/_types/openApiAccess';
import { PickNullable } from '@/types';
import { z } from 'zod';

class PostApiService extends ApiService {
  /**
   * @description 내가 작성한 게시글 목록 조회
   *
   * @returns 내가 작성한 게시글 목록
   */
  async fetchPosts({
    page = 0,
    size = 12,
  }: Required<GetQueryParams['/posts']>): Promise<FetchPostsSchema> {
    const res = await this.fetcher(`/posts?page=${page}&size=${size}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return fetchPostsSchema.parse(data);
  }

  /**
   * @description 특정 게시글 정보 조회
   */
  async fetchPost(
    postId: GetPathParams['/posts/{postId}']['postId'],
  ): Promise<FetchPostDetailsSchema> {
    const res = await this.fetcher(`/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return fetchPostDetailsSchema.parse(data);
  }

  /**
   * @description 특정 가게의 포스트 목록 조회
   *
   * @returns 가게의 포스트 목록
   */
  async fetchStorePosts({
    storeId,
    page = 0,
    size = 12,
  }: Partial<GetQueryParams['/map/posts']>): Promise<FetchStorePostsSchema> {
    const res = await this.fetcher(
      `/map/posts?storeId=${storeId}&page=${page}&size=${size}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await res.json();

    return fetchStorePostsSchema.parse(data);
  }

  /**
   * @description 게시글 작성
   *
   * @returns {object} success ? 성공 string : 실패 object
   */
  async addPost(formData: FormData): Promise<PostResponses['/posts']> {
    const res = await this.fetcher(`/posts`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await res.json();

    return data;
  }

  /**
   * @description 리뷰 AI 자동완성
   *
   * @returns {object} 자동완성된 content
   */
  async fetchAIAutoReview({
    postCategory,
    menuName,
  }: Required<PostParameters['/posts/auto']>): Promise<AiAutoReviewResponse> {
    const res = await this.fetcher(`/posts/auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postCategory,
        menuName,
      }),
    });

    const data = await res.json();

    return aiAutoReviewResponse.parse(data);
  }
}

const fetchPostsSchema = z.array(
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
    Omit<
      PickNullable<Required<GetResponses['/posts'][number]>, 'updatedDate'>,
      'menuImage'
    > & {
      menuImage: {
        id: number;
        url: string;
      };
    }
  >
>;
export type FetchPostsSchema = z.infer<typeof fetchPostsSchema>;

const fetchStorePostsSchema = z.array(
  z.object({
    postId: z.number(),
    memberUsername: z.string(),
    postMainMenu: z.string(),
    storeName: z.string(),
    category: z.enum([
      'KOREAN',
      'CHINESE',
      'JAPANESE',
      'WESTERN',
      'DESSERT',
      'CAFE',
    ]),
    menuImage: z.object({
      id: z.number(),
      url: z.string(),
    }),
    menuPrice: z.number(),
    createdDate: z.string(),
    updatedDate: z.string().nullable(),
  }),
) satisfies z.ZodType<
  Array<
    PickNullable<Required<GetResponses['/map/posts'][number]>, 'updatedDate'>
  >
>;
export type FetchStorePostsSchema = z.infer<typeof fetchStorePostsSchema>;

const fetchPostDetailsSchema = z.object({
  postId: z.number(),
  memberUsername: z.string(),
  storeName: z.string(),
  storeLocation: z.object({
    address: z.string(),
    posx: z.number(),
    posy: z.number(),
  }),
  postMainMenu: z.string(),
  postCategory: z.enum([
    'KOREAN',
    'CHINESE',
    'JAPANESE',
    'WESTERN',
    'DESSERT',
    'CAFE',
  ]),
  permission: z.enum(['PRIVATE', 'PUBLIC', 'FRIENDS']),
  createdDate: z.string(),
  updatedDate: z.string().nullable(),
  menus: z.array(
    z.object({
      menuId: z.number(),
      menuImage: z.object({
        id: z.number(),
        url: z.string(),
      }),
      menuName: z.string(),
      menuPrice: z.number(),
      menuContent: z.string(),
    }),
  ),
  auto: z.boolean(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/posts/{postId}']>, 'updatedDate'>
>;
export type FetchPostDetailsSchema = z.infer<typeof fetchPostDetailsSchema>;

const aiAutoReviewResponse = z.object({
  menuContent: z.string(),
}) satisfies z.ZodType<Required<PostResponses['/posts/auto']>>;
export type AiAutoReviewResponse = z.infer<typeof aiAutoReviewResponse>;

export const postApiService = new PostApiService();
