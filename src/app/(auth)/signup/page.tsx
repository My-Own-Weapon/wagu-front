'use client';

import InputBox from '@/components/ui/InputBox';

import Image from 'next/image';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { handleSubmitAction } from './handleSubmitAction';

import s from './page.module.scss';

interface SignupState {
  message: string;
  succ: boolean;
}

export default function SignupPage() {
  const [signupState, formAction] = useFormState<SignupState, FormData>(
    handleSubmitAction,
    {
      message: '',
      succ: true,
    },
  );

  return (
    <main className={s.container}>
      <form className={s.form} action={formAction}>
        <InputBox
          className={s.inputBox}
          label="아이디"
          name="username"
          type="text"
          placeholder="아이디를 입력해 주세요"
        />
        <InputBox
          className={s.inputBox}
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
        />
        <InputBox
          className={s.inputBox}
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
        />
        <InputBox
          className={s.inputBox}
          label="이름"
          name="name"
          type="text"
          placeholder="이름을 입력해 주세요"
        />
        <InputBox
          className={s.inputBox}
          label="휴대폰 번호"
          name="phoneNumber"
          type="text"
          placeholder="휴대폰 번호를 입력해 주세요"
        />
        {!signupState.succ && (
          <p className={s.message}>{signupState.message}</p>
        )}
        <button type="submit" className={s.signupButton}>
          회원가입
        </button>
        <Pending />
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
        <Link className={s.loginLink} href="/login" passHref legacyBehavior>
          로그인
        </Link>
      </div>
    </main>
  );
}

function Pending() {
  const { pending } = useFormStatus();

  return pending ? <div>회원가입중...</div> : null;
}
