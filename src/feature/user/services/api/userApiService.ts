import ApiService from '@/feature/_lib/ApiService';
import {
  GetResponses,
  PostResponses,
  DeleteResponses,
  GetPathParams,
  PostPathParams,
  PathParams,
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
    username: GetPathParams['/member/{username}/profile']['username'],
  ): Promise<ProfileDetailsSchema> {
    const res = await this.fetcher(`/member/${username}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return profileDetailsSchema.parse(data);
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
  ): Promise<ProfileWithFollowInfoSchema> {
    const res = await this.fetcher(`/members/${memberId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return profileWithFollowInfoSchema.parse(data);
  }

  /**
   * @description user의 followings 조회
   *
   * @returns followings list
   */
  async fetchFollowings(): Promise<FollowingsSchema> {
    const res = await this.fetcher(`/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    return followingsSchema.parse(data);
  }

  /**
   * @description user 팔로우
   *
   * @returns 팔로우 성공 여부
   */
  async followUser(
    memberId: PostPathParams['/members/{fromMemberId}/follow'],
  ): Promise<FollowUserSchema> {
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
    memberId: PathParams<'delete'>['/members/{fromMemberId}/follow'],
  ): Promise<UnFollowUserSchema> {
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
  async searchUsers(name: string): Promise<SearchUsersSchema> {
    const res = await this.fetcher(`/members?username=${name}&page=0&size=12`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    return searchUsersSchema.parse(data);
  }
}

const profileDetailsSchema = z.object({
  memberId: z.number(),
  imageUrl: z.string().nullable(),
  username: z.string(),
  name: z.string(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/member/{username}/profile']>, 'imageUrl'>
>;
export type ProfileDetailsSchema = z.infer<typeof profileDetailsSchema>;

const profileWithFollowInfoSchema = z.object({
  userName: z.string(),
  followerNum: z.number(),
  followingNum: z.number(),
  postNum: z.number(),
  profileImage: z.string().nullable(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/members/{memberId}']>, 'profileImage'>
>;
export type ProfileWithFollowInfoSchema = z.infer<
  typeof profileWithFollowInfoSchema
>;

const followingsSchema = z.array(
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
export type FollowingsSchema = z.infer<typeof followingsSchema>;

const followUserSchema = z.string() satisfies z.ZodType<
  PostResponses['/members/{fromMemberId}/follow']
>;
export type FollowUserSchema = z.infer<typeof followUserSchema>;

const unFollowUserSchema = z.string() satisfies z.ZodType<
  DeleteResponses['/members/{fromMemberId}/follow']
>;
type UnFollowUserSchema = z.infer<typeof unFollowUserSchema>;

const searchUsersSchema = z.array(
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
type SearchUsersSchema = z.infer<typeof searchUsersSchema>;

export const userApiService = new UserApiService();
