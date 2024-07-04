'use client';

import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackBtn';
import InputBox from '@/components/ui/InputBox';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { handleSubmitAction } from './handleSubmitAction';
import s from './page.module.scss';

export default function LoginPage() {
  const [state, formAction] = useFormState(handleSubmitAction, {
    message: null,
  });
  const { pending } = useFormStatus();
  const router = useRouter();

  if (state.status === 200) {
    router.push('/');
  }

  return (
    <main className={s.container}>
      <div className={s.header}>
        <BackButton />
        <h1 className={s.title}>로그인</h1>
      </div>
      <form className={s.form} action={formAction}>
        <InputBox
          className={s.inputBox}
          label="아이디"
          name="username"
          placeholder="아이디를 입력해 주세요"
          type="text"
        />
        <InputBox
          className={s.inputBox}
          label="비밀번호"
          name="password"
          placeholder="비밀번호를를 입력해 주세요"
          type="password"
        />
        <Pending />
        {state.status !== 200 && <div className={s.error}>{state.message}</div>}
        <button type="submit" className={s.loginBtn} disabled={pending}>
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

function Pending() {
  const { pending } = useFormStatus();

  if (pending) {
    return <div>로그인중 중...</div>;
  }

  return null;
}
