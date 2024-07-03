'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import s from './page.module.scss';
import Link from 'next/link';

interface Credentials {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (credentials: Credentials) => {
    console.log('실행됨');
    const response = await fetch('http://3.39.118.22:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const credentials: Credentials = { username, password };
      console.log(credentials);
      const response = await loginUser(credentials);
      if (response.success) {
        console.log('Login successful', response);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <main className={s.container}>
      <div className={s.header}>
        <Link href="/" passHref>
          <span className={s.backButton}>←</span>
        </Link>
        <h1 className={s.title}>로그인</h1>
      </div>
      <form className={s.form} onSubmit={handleLogin}>
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
        {error && <p className={s.error}>{error}</p>}
        <button type="submit" className={s.loginButton}>
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
      <div className={s.homeIndicator}></div>
    </main>
  );
}
