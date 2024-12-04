import Image from 'next/image';
import Link from 'next/link';

import s from './VotePhaseHeader.module.scss';

export default function VotePhaseHeader() {
  return (
    <header className={s.sharePageHeaderContainer}>
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        <Link href="/search">
          <Image
            src="/newDesign/nav/search_glass_gray.svg"
            alt="search-btn"
            width={24}
            height={24}
          />
        </Link>
        <div className={s.profileContainer}>
          <Image
            className={s.profileIcon}
            src="/newDesign/nav/profile_gray.svg"
            alt="profile-btn"
            width={24}
            height={24}
          />
          <div className={s.dropdownMenu}>
            <Link className={s.myPage} href="/profile">
              마이페이지
            </Link>
            <div className={s.logout}>
              <button type="button" className={s.logoutBtn}>
                <p className={s.text}>로그아웃</p>
              </button>
              <Image
                src="/newDesign/sign_out.svg"
                alt="arrow-down"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
