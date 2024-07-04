'use server';

import { apiService } from '@/services/apiService';
import { delay } from '@/utils/delay';
import { cookies } from 'next/headers';

export const handleSubmitAction = async (
  prevState: { message: null } | { message: string },
  formData: FormData,
) => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  await delay(1000);

  try {
    const res = await apiService.login({ username, password });
    if (res.status === 403) {
      return {
        message: '잘못된 입력.',
      };
    }

    if (res.status === 200) {
      cookies().set('token', res.accessToken);
      return res;
    }
    return {
      message: '로그인에 실패했습니다.',
    };
  } catch (e) {
    return {
      message: '회원가입에 실패했습니다.',
    };
  }
};
