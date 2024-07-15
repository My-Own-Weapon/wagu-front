'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSelectedLayoutSegment } from 'next/navigation';

import s from './Footer.module.scss';

const footerMap = [
  { id: 1, icon: 'home', text: 'Home', href: '/' },
  { id: 2, icon: 'vote', text: 'Vote', href: '/map' },
  { id: 3, icon: 'pencil', text: 'Write', href: '/write' },
  { id: 4, icon: 'compass', text: 'Map', href: '/map' },
  { id: 5, icon: 'tv', text: 'Live', href: '/live' },
];

export default function Footer() {
  const segment = useSelectedLayoutSegment();
  if (segment === '(auth)') {
    return null;
  }

  return (
    <nav className={s.container}>
      {footerMap.map(({ icon, text, href, id }) => (
        <Link className={s.wrapper} key={`footer-${id}`} href={href}>
          <div className={s.iconArea}>
            <Image
              src={`/images/emoji/${icon}.svg`}
              alt="footer-icon"
              width={24}
              height={24}
            />
            <p>{text}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
}
