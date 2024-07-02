'use client';

import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackBtn';
import InputBox from '@/components/ui/InputBox';
import { apiService } from '@/services/apiService';
import { SignupDetails } from '@/types';
import { useRouter } from 'next/navigation';
import s from './page.module.scss';

export default function SignupPage() {
  const [signupDetails, setSignupDetails] = useState<SignupDetails>({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
  });
  const [signupFailMsg, setSignupFailMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setSignupDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await apiService.signup(signupDetails);

    if (res.ok || res.status === 200) {
      router.push('/login');
    } else {
      setSignupFailMsg('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <main className={s.container}>
      <div className={s.header}>
        <BackButton />
        <h1 className={s.title}>회원가입</h1>
      </div>
      <form className={s.form} onSubmit={handleSubit}>
        <InputBox
          className={s.inputBox}
          label="아이디"
          name="username"
          value={signupDetails.username}
          type="text"
          placeholder="아이디를 입력해 주세요"
          onChange={handleChange}
        />
        <InputBox
          className={s.inputBox}
          label="비밀번호"
          name="password"
          value={signupDetails.password}
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          onChange={handleChange}
        />
        <InputBox
          className={s.inputBox}
          label="비밀번호 확인"
          name="passwordConfirm"
          value={signupDetails.passwordConfirm}
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
          onChange={handleChange}
        />
        <InputBox
          className={s.inputBox}
          label="이름"
          name="name"
          value={signupDetails.name}
          type="text"
          placeholder="이름을 입력해 주세요"
          onChange={handleChange}
        />
        <InputBox
          className={s.inputBox}
          label="휴대폰 번호"
          name="phoneNumber"
          value={signupDetails.phoneNumber}
          type="tel"
          placeholder="휴대폰 번호를 입력해 주세요"
          onChange={handleChange}
        />
        {signupFailMsg && <p className={s.message}>{signupFailMsg}</p>}
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
          <a className={s.loginLink} href="/">
            로그인
          </a>
        </Link>
      </div>
      <div className={s.homeIndicator} />
    </main>
  );
}

// const handleSignup = async (e: FormEvent) => {
//   e.preventDefault();
//   setError(null);
//   setMessage(null);

//   if (!signupDetails || !password || !passwordConfirm) {
//     setError('모든 필드를 입력해 주세요.');
//     return;
//   }

//   if (password !== passwordConfirm) {
//     setError('비밀번호가 일치하지 않습니다.');
//     return;
//   }

//   try {
//     const credentials: SignupCredentials = {
//       username: signupDetails,
//       password,
//       passwordConfirm,
//     };
//     const response = await signupUser(credentials);
//     setMessage('회원가입 성공');
//     console.log('Signup successful', response);
//   } catch (err) {
//     if (err instanceof APIError) {
//       setError(err.message);
//     } else {
//       setError('회원가입 중 오류가 발생했습니다.');
//     }
//   }
// };
