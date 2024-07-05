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

    if (res.status === 200) {
      cookies().set('token', res.accessToken);
      return res;
    }

    if (res.status === 403) {
      return {
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      };
    }

    return {
      message: `invalid res status. ${res.status}`,
    };
  } catch (e) {
    return {
      message: 'login fetch error.',
    };
  }
};
