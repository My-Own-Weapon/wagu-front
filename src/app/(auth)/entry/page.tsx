import Link from 'next/link';
import Image from 'next/image';
import BoxButton from '@/components/ui/BoxButton';
import Heading from '@/components/ui/Heading';

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
            <Heading
              as="h2"
              fontSize="18px"
              fontWeight="bold"
              color="black"
              title="너와 나의 맛집 기록"
            />
          </div>
        </div>
        <div className={s.btnArea}>
          <Link
            style={{
              width: '100%',
            }}
            href="/signup"
          >
            <BoxButton width="100%" height="56px" variant="fill">
              회원가입
            </BoxButton>
          </Link>
          <Link
            style={{
              width: '100%',
            }}
            href="/login"
          >
            <BoxButton width="100%" height="56px" variant="outline">
              로그인
            </BoxButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
