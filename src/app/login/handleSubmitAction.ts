'use server';

import { apiService } from '@/services/apiService';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface State {
  message: string | null;
}

export const handleSubmitAction = async (
  prevState: State,
  formData: FormData,
) => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  // const res = await apiService.login({ username, password });
  const res = await fetch('http://3.39.118.22:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  console.log(res);

  if (res.status === 200) {
    const sessionId = res.headers.get('set-cookie'); // 세션 ID를 포함한 쿠키 헤더 추출
    console.log('sessionId is :', sessionId);
    // const edcoded = decodeURIComponent(sessionId);
    // console.log('decoded : ', edcoded);
    const [cookie] = sessionId ? sessionId.split(';') : [];

    console.log('제발', cookie);
    const [, session] = cookie.split('JSESSIONID=');
    console.log('session : ', session);
    // eslint-disable-next-line max-depth
    if (sessionId) {
      cookies().set('Cookie', session);
      cookies().set('username', username);
    }
  }

  if (res.status === 403) {
    return {
      message: '아이디 또는 비밀번호가 일치하지 않습니다.',
    };
  }

  return redirect('/'); // 로그인 성공 시 메인 페이지로 리다이렉트
};
