'use client';

import InputBox from '@/components/ui/InputBox';
import { apiService } from '@/services/apiService';

import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { localStorageApi } from '@/services/localStorageApi';

import s from './page.module.scss';

export default function LoginPage() {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await apiService.login(loginInfo);
      localStorageApi.setUserName(loginInfo.username);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <main className={s.container}>
      <form className={s.form} onSubmit={handleSubmit}>
        <InputBox
          className={s.inputBox}
          height="56px"
          label="아이디"
          name="username"
          placeholder="아이디를 입력해 주세요"
          onChange={handleChange}
          type="text"
        />
        <InputBox
          className={s.inputBox}
          height="56px"
          label="비밀번호"
          name="password"
          placeholder="비밀번호를를 입력해 주세요"
          onChange={handleChange}
          type="password"
        />
        {errorMsg && <div className={s.error}>{errorMsg}</div>}
        <button type="submit" className={s.loginBtn}>
          로그인
        </button>
      </form>
      <div className={s.socialLogin}>
        <div className={s.divider}>
          <span>간편한 로그인</span>
        </div>
        <div className={s.socialButtons}>
          <div className={s.socialButton}>
            <Image src="/GoogleLogo.png" alt="Google" width={24} height={24} />
          </div>
          <div className={s.socialButton}>
            <Image src="/KakaoLogo.png" alt="Kakao" width={24} height={24} />
          </div>
        </div>
      </div>
      <div className={s.footer}>
        계정이 아직 없나요?{' '}
        <Link href="/signup">
          <span className={s.signupLink}>회원가입</span>
        </Link>
      </div>
      <div className={s.homeIndicator} />
    </main>
  );
}
