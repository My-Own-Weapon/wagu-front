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

  if (segment === '(auth)' || segment === 'posts') {
    return null;
  }
  if (segments.length >= 2) {
    if (segments[segments.length - 1] === 'board') return null;
    const [, , postid] = segments;
    if (!!postid) return null;
  }

  return (
    <header className={s.container}>
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
        <Link href="/search">Search</Link>
      </div>
    </header>
  );
}
