'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation';

import s from './Header.module.scss';

export default function Header() {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();

  if (segment === '(auth)' || segment === '(post)' || segment === 'live') {
    return null;
  }
  if (segments.length >= 2) {
    if (segments[segments.length - 1] === 'board') return null;
    const [, , postid] = segments;
    if (!!postid) return null;
  }

  return (
    <header
      className={s.container}
      style={segment === 'search' ? { backgroundColor: '#fffaf3' } : {}}
    >
      <div>
        <Link href="/">
          <p className={s.logoTitle}>WAGU BOOK</p>
        </Link>
      </div>
      <div className={s.navBtnArea}>
        {segment !== 'search' ? (
          <Link href="/search">
            <Image
              src="/newDesign/search_glass.svg"
              alt="search-btn"
              width={24}
              height={24}
            />
          </Link>
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
            }}
          />
        )}

        <Link href="/profile">
          <Image
            src="/newDesign/user_profile.svg"
            alt="heart-btn"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </header>
  );
}
