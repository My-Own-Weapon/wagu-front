'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import s from './Footer.module.scss';

const footerMap = [
  { id: 1, icon: '🏠', text: 'home', href: '/' },
  { id: 2, icon: '🗳️', text: 'vote', href: '/map' },
  { id: 3, icon: '✍️', text: 'write', href: '/board' },
  { id: 4, icon: '🧭', text: 'map', href: '/map' },
  { id: 5, icon: '📺', text: 'live', href: '/live' },
];

export default function Footer() {
  const segment = useSelectedLayoutSegment();
  if (segment === '(auth)') {
    return null;
  }

  return (
    <nav className={s.container}>
      {footerMap.map(({ icon, text, href, id }) => (
        <Link key={`footer-${id}`} href={href}>
          <div>
            <span>{icon}</span>
            <p>{text}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
}
