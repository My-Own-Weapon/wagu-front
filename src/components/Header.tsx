'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation';

import HeaderLogo from '@public/images/header-logo.svg';

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
      <div className={s.profileArea}>
        <Image
          src="/profile/profile-default-icon-male.svg"
          alt="profile"
          width={40}
          height={40}
        />
      </div>
      <div>
        <Link href="/">
          <HeaderLogo />
        </Link>
      </div>
      <div>
        {segment !== 'search' ? (
          <Link href="/search">
            <Image
              src="/images/search-glass.svg"
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
      </div>
    </header>
  );
}
