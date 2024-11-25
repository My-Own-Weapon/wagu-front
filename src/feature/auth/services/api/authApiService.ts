import ApiService from '@/feature/_lib/ApiService';
import {
  ApiParameters,
  ApiResponses,
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
    const message = await res.text();

    return logoutServerResponse.parse(message);
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

    return signupServerResponse.parse(message);
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
    const message = await res.text();

    return checkLoginSessionServerResponse.parse(message);
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

const logoutServerResponse = z.string() satisfies z.ZodType<
  Required<GetResponses['/logout']>
>;
export type LogoutServerResponse = z.infer<typeof logoutServerResponse>;

const signupServerResponse = z.string() satisfies z.ZodType<
  Required<PostResponses['/join']>
>;
export type SignupServerResponse = z.infer<typeof signupServerResponse>;

const checkLoginSessionServerResponse = z.string() satisfies z.ZodType<
  Required<GetResponses['/session']>
>;
export type CheckLoginSessionServerResponse = z.infer<
  typeof checkLoginSessionServerResponse
>;

const ERROR_MESSAGE = {
  CHECK_LOGIN_SESSION:
    '로그인 유지 기간이 만료되었습니다. 다시 로그인해주세요.',
};

export const authApiService = new AuthApiService();
