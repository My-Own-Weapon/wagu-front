import ApiService from '@/feature/_lib/ApiService';
import {
  ApiParameters,
  ApiResponses,
  PostResponses,
} from '@/feature/_types/openApiAccess';
import CheckLoginSessionError from '@/feature/auth/services/api/errors/CheckLoginSessionError';
import { z } from 'zod';

const loginServerResponse = z.object({
  memberUsername: z.string(),
  memberImage: z.object({
    id: z.number().optional().nullable(),
    url: z.string().optional().nullable(),
  }),
}) as z.ZodType<Required<PostResponses['/login']>>;

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
  }: ApiParameters['/join']['POST']): Promise<PostResponses['/join']> {
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

  public async checkLoginSession(): Promise<ApiResponses['/session']['GET']> {
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
}

export const ERROR_MESSAGE = {
  CHECK_LOGIN_SESSION:
    '로그인 유지 기간이 만료되었습니다. 다시 로그인해주세요.',
};

export const authApiService = new AuthApiService();
