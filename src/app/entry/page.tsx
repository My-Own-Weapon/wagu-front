import Image from 'next/image';
import s from './page.module.scss';

export default function EntryPage() {
  return (
    <main className={s.container}>
      <div className={s.logo}>
        <Image
          src="/wagu-logo.svg"
          alt="WAGU BOOK Logo"
          width={83.5}
          height={85}
          priority
        />
      </div>
      <h1>WAGU BOOK</h1>
      <p>너와 나의 맛집 기록</p>
      <button className={s.button}>회원가입</button>
      <button className={s.buttonOutline}>로그인</button>
    </main>
  );
}
