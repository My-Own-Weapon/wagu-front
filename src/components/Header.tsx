'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import s from './Header.module.scss';

export default function Header() {
  const segment = useSelectedLayoutSegment();
  if (segment === '(auth)') {
    return null;
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
        <Link href="/">wagu book</Link>
      </div>
      <div>
        <Link href="/search">Search</Link>
      </div>
    </header>
  );
}
