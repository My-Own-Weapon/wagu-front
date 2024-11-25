import ApiService from '@/feature/_lib/ApiService';
import {
  ApiParameters,
  ApiResponses,
  GetPathParams,
  GetResponses,
  PostResponses,
} from '@/feature/_types/openApiAccess';
import CheckLoginSessionError from '@/feature/auth/services/api/errors/CheckLoginSessionError';
import { PickNullable } from '@/types';
import { z } from 'zod';

class AuthApiService extends ApiService {
  async login({
    username,
    password,
  }: Required<ApiParameters['/login']['POST']>) {
    const res = await this.fetcher(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    const data = await res.json();

    return loginServerResponse.parse(data);
  }

  async logout() {
    const res = await this.fetcher(`/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.text();
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

    return res.text();
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
        errorMessage: ERROR_MESSAGE.CHECK_LOGIN_SESSION,
      },
    );

    return res.text();
  }

  async fetchUserProfile({
    username,
  }: GetPathParams['/member/{username}/profile']): Promise<ProfileServerResponse> {
    const res = await this.fetcher(`/member/${username}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    return profileServerResponse.parse(data);
  }
}

const loginServerResponse = z.object({
  memberUsername: z.string(),
  memberImage: z.object({
    id: z.number().nullable(),
    url: z.string().nullable(),
  }),
}) satisfies z.ZodType<
  PickNullable<Required<PostResponses['/login']>, 'memberImage'>
>;
export type LoginServerResponse = z.infer<typeof loginServerResponse>;

const profileServerResponse = z.object({
  memberId: z.number(),
  imageUrl: z.string().nullable(),
  username: z.string(),
  name: z.string(),
}) satisfies z.ZodType<
  PickNullable<Required<GetResponses['/member/{username}/profile']>, 'imageUrl'>
>;
export type ProfileServerResponse = z.infer<typeof profileServerResponse>;
export const fetchUserProfileParams = z.object({
  username: z.string(),
}) satisfies z.ZodType<GetPathParams['/member/{username}/profile']>;

const ERROR_MESSAGE = {
  CHECK_LOGIN_SESSION:
    '로그인 유지 기간이 만료되었습니다. 다시 로그인해주세요.',
};

export const authApiService = new AuthApiService();
