import ApiService from '@/feature/_lib/ApiService';
import {
  GetResponses,
  PostResponses,
  DeleteResponses,
  GetQueryParams,
  PostQueryParams,
  QueryParams,
} from '@/feature/_types/openApiAccess';
import { PickNullable } from '@/types';
import { z } from 'zod';

class UserApiService extends ApiService {
  /**
   * @description user의 profile 정보조회
   *
   * @returns user profile image & full name
   */
  async fetchProfileWithoutFollow(
    username: GetQueryParams['/member/{username}/profile'],
  ): Promise<ProfileDetailsResponse> {
    const res = await this.fetcher(`/member/${username}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return profileDetailsResponse.parse(data);
  }

  /**
   * @description user의 follow 및 post 작성 개수 정보 조회
   *
   * @before async fetchProfileWithoutFollow(
   * @after async fetchProfileDetails(username)
   *
   * @returns follow count, follower count, post count, profile image
   */
  async fetchProfileWithFollowInfo(
    memberId: number,
  ): Promise<ProfileWithFollowInfoResponse> {
    const res = await this.fetcher(`/members/${memberId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return profileWithFollowInfoResponse.parse(data);
  }

  /**
   * @description user의 followings 조회
   *
   * @returns followings list
   */
  async fetchFollowings(): Promise<FollowingsResponse> {
    const res = await this.fetcher(`/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    return followingsResponse.parse(data);
  }

  /**
   * @description user 팔로우
   *
   * @returns 팔로우 성공 여부
   */
  async followUser(
    memberId: PostQueryParams['/members/{fromMemberId}/follow'],
  ): Promise<FollowUserResponse> {
    const res = await this.fetcher(`/members/${memberId}/follow`, {
      method: 'POST',
      credentials: 'include',
    });

    return res.text();
  }

  /**
   * @description user 언팔로우
   *
   * @returns 언팔로우 성공 여부
   */
  async unFollowUser(
    memberId: QueryParams<'delete'>['/members/{fromMemberId}/follow'],
  ): Promise<UnFollowUserResponse> {
    const res = await this.fetcher(`/members/${memberId}/follow`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return res.text();
  }

  /**
   * @description name으로 user 검색
   *
   * @returns name을 포함한 검색된 user 목록
   */
  async searchUsers(name: string): Promise<SearchUsersResponse> {
    const res = await this.fetcher(`/members?username=${name}&page=0&size=12`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    return searchUsersResponse.parse(data);
  }
}

const profileDetailsResponse = z.object({
  memberId: z.number(),
  imageUrl: z.string().nullable(),
  username: z.string(),
  name: z.string(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/member/{username}/profile']>, 'imageUrl'>
>;
type ProfileDetailsResponse = z.infer<typeof profileDetailsResponse>; // 새로운 타입 정의

const profileWithFollowInfoResponse = z.object({
  userName: z.string(),
  followerNum: z.number(),
  followingNum: z.number(),
  postNum: z.number(),
  profileImage: z.string().nullable(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/members/{memberId}']>, 'profileImage'>
>;
type ProfileWithFollowInfoResponse = z.infer<
  typeof profileWithFollowInfoResponse
>;

const followingsResponse = z.array(
  z.object({
    memberId: z.number(),
    username: z.string(),
    memberImageUrl: z.string().nullable(),
    live: z.boolean(),
    each: z.boolean(),
  }),
) satisfies z.ZodType<
  Array<
    PickNullable<
      Required<GetResponses['/followings'][number]>,
      'memberImageUrl'
    >
  >
>;
type FollowingsResponse = z.infer<typeof followingsResponse>;

const followUserResponse = z.string() satisfies z.ZodType<
  PostResponses['/members/{fromMemberId}/follow']
>;
type FollowUserResponse = z.infer<typeof followUserResponse>;

const unFollowUserResponse = z.string() satisfies z.ZodType<
  DeleteResponses['/members/{fromMemberId}/follow']
>;
type UnFollowUserResponse = z.infer<typeof unFollowUserResponse>;

const searchUsersResponse = z.array(
  z.object({
    memberId: z.number(),
    memberUsername: z.string(),
    memberImage: z.object({
      url: z.string().nullable(),
      id: z.number().nullable(),
    }),
    to: z.boolean(),
    from: z.boolean(),
    each: z.boolean(),
  }),
) satisfies z.ZodType<
  Array<
    Omit<Required<GetResponses['/members'][number]>, 'memberImage'> & {
      memberImage: {
        url: string | null;
        id: number | null;
      };
    }
  >
>;
type SearchUsersResponse = z.infer<typeof searchUsersResponse>;

export const userApiService = new UserApiService();
