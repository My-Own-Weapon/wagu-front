import { z } from 'zod';

import ApiService from '@/lib/ApiService';
import {
  GetResponses,
  PostResponses,
  DeleteResponses,
  GetPathParams,
  PostPathParams,
  PathParams,
  ApiParameters,
  ApiResponses,
} from '@/types/openApiAccess';
import CheckLoginSessionError from '@/services/errors/CheckLoginSessionError';
import { PickNullable } from '@/types';
import {
  AuthPort,
  AuthPortInput,
  AuthPortOutput,
} from '@/feature/user/application/port/out/AuthPort';
import { injectable } from 'tsyringe';

@injectable()
export default class UserApiAdapter extends ApiService implements AuthPort {
  async authenticate({
    userName,
    password,
  }: AuthPortInput): Promise<AuthPortOutput> {
    const serverParams = {
      username: userName,
      password,
    } satisfies Required<ApiParameters['/login']['POST']>;
    const res = await this.fetcher(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serverParams),
      credentials: 'include',
    });
    const data = await res.json();
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      return {
        ok: false,
        reason: result.error.message,
        error: result.error,
      };
    }

    return {
      ok: true,
      data: {
        userName: result.data.memberUsername,
        profileImageUrl: result.data.memberImage.url ?? '',
      },
    };
  }

  async logout() {
    const res = await this.fetcher(`/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    const message = await res.text();

    return logoutSchema.parse(message);
  }

  async signup({
    username,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  }: Required<ApiParameters['/join']['POST']>) {
    const res = await this.fetcher(`/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirm,
        name,
        phoneNumber,
      }),
    });
    const message = await res.text();

    return signupSchema.parse(message);
  }

  async checkLoginSession(): Promise<ApiResponses['/session']['GET']> {
    const res = await this.fetcher(
      '/session',
      {
        method: 'GET',
        credentials: 'include',
      },
      {
        CustomError: CheckLoginSessionError,
        errorMessage: '로그인 유지 기간이 만료되었습니다. 다시 로그인해주세요.',
      },
    );
    const message = await res.text();

    return checkLoginSessionSchema.parse(message);
  }

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

const loginSchema = z.object({
  memberUsername: z.string(),
  memberImage: z.object({
    id: z.number().nullable(),
    url: z.string().nullable(),
  }),
}) satisfies z.ZodType<
  PickNullable<Required<PostResponses['/login']>, 'memberImage'>
>;
export type LoginSchema = z.infer<typeof loginSchema>;

const logoutSchema = z.string() satisfies z.ZodType<
  Required<GetResponses['/logout']>
>;
export type LogoutSchema = z.infer<typeof logoutSchema>;

const signupSchema = z.string() satisfies z.ZodType<
  Required<PostResponses['/join']>
>;
export type SignupServerResponse = z.infer<typeof signupSchema>;

const checkLoginSessionSchema = z.string() satisfies z.ZodType<
  Required<GetResponses['/session']>
>;
export type CheckLoginSessionServerResponse = z.infer<
  typeof checkLoginSessionSchema
>;

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
export type UnFollowUserSchema = z.infer<typeof unFollowUserSchema>;

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
export type SearchUsersSchema = z.infer<typeof searchUsersSchema>;
