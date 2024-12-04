import Link from 'next/link';
import Image from 'next/image';

import s from './ResultPhaseHeader.module.scss';

export default function ResultHeader() {
  return (
    <header className={s.resultHeaderContainer}>
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        <Link href="/search">
          <Image
            src="/newDesign/nav/search_glass.svg"
            alt="search-btn"
            width={24}
            height={24}
          />
        </Link>
        <Link href="/profile">
          <Image
            src="/newDesign/nav/user_profile.svg"
            alt="heart-btn"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </header>
  );
}
