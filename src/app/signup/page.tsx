'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import s from './page.module.scss';

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirm: string;
}

class APIError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
  }
}

const signupUser = async (credentials: SignupCredentials) => {
  console.log('실행됨');
  const response = await fetch('http://3.39.118.22:8080/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new APIError(errorData.message || '회원가입 실패', response.status);
  }

  return response.json();
};

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username || !password || !passwordConfirm) {
      setError('모든 필드를 입력해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const credentials: SignupCredentials = {
        username,
        password,
        passwordConfirm,
      };
      const response = await signupUser(credentials);
      setMessage('회원가입 성공');
      console.log('Signup successful', response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <main className={s.container}>
      <div className={s.header}>
        <Link href="/" passHref legacyBehavior>
          <a className={s.backButton}>
            <Image src="/BackIcon.svg" alt="Back" width={18} height={18} />
          </a>
        </Link>
        <h1 className={s.title}>회원가입</h1>
      </div>
      <form className={s.form} onSubmit={handleSignup}>
        <div>
          <label htmlFor="username" className={s.label}>
            아이디
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className={s.input}
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className={s.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={s.input}
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirm" className={s.label}>
            비밀번호 확인
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className={s.input}
            placeholder="************"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        {error && <p className={s.error}>{error}</p>}
        {message && <p className={s.message}>{message}</p>}
        <button type="submit" className={s.signupButton}>
          회원가입
        </button>
      </form>
      <div className={s.socialSignup}>
        <div className={s.divider}>
          <span>간편한 회원가입</span>
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
        계정이 이미 있나요?{' '}
        <Link href="/login" passHref legacyBehavior>
          <a className={s.loginLink}>로그인</a>
        </Link>
      </div>
      <div className={s.homeIndicator}></div>
    </main>
  );
}
