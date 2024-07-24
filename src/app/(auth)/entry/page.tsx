import Link from 'next/link';
import Image from 'next/image';
import s from './page.module.scss';

export default function EntryPage() {
  return (
    <main className={s.container}>
      <div className={s.wrapper}>
        <div className={s.logoTitleArea}>
          <div className={s.logoWrapper}>
            <Image
              src="/newDesign/logos/wagu_logo.svg"
              alt="WAGU BOOK Logo"
              width={85}
              height={85}
              priority
            />
            <h1 className={s.title}>WAGU BOOK</h1>
          </div>
          <h2 className={s.subTitle}>너와 나의 맛집 기록</h2>
        </div>
        <div className={s.btnArea}>
          <Link className={s.signupBtn} href="/signup">
            회원가입
          </Link>
          <Link className={s.loginBtn} href="/login">
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
