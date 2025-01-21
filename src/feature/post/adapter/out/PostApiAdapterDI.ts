/* eslint-disable brace-style */

import { injectable } from 'tsyringe';

import ApiService from '@/lib/ApiService';
import {
  GetPathParams,
  GetQueryParams,
  PostParameters,
  PostResponses,
} from '@/types/openApiAccess';
import { FetchMyPostPort } from '@/feature/post/application/port/out/FetchMyPostPort';
import {
  AiAutoReviewResponse,
  aiAutoReviewResponse,
  FetchPostDetailsSchema,
  fetchPostDetailsSchema,
  fetchPostsSchema,
  FetchStorePostsSchema,
  fetchStorePostsSchema,
} from '@/feature/post/adapter/out/schema';
import { convertPostEntity } from '@/feature/post/adapter/out/converters';
import { Post } from '@/feature/post/domain/Post';

@injectable()
export default class PostApiAdapter
  extends ApiService
  implements FetchMyPostPort
{
  /**
   * @description 내가 작성한 게시글 목록 조회
   *
   * @returns 내가 작성한 게시글 목록
   */
  async fetchMyPosts({
    page = 0,
    size = 12,
  }: Required<GetQueryParams['/posts']>): Promise<Post[]> {
    const res = await this.fetcher(`/posts?page=${page}&size=${size}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    const { success, data: posts } = fetchPostsSchema.safeParse(data);

    if (!success) {
      throw new Error('Failed to fetch my posts');
    }

    return posts.map(convertPostEntity);
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
