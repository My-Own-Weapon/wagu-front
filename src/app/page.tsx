'use client';

import { useRouter } from 'next/navigation';
import s from './page.module.scss';

export default function Home() {
  const router = useRouter();

  const isCookieExist = () => {
    return document.cookie.includes('token');
  };

  if (!isCookieExist()) router.push('/entry');

  return <main className={s.container}>wagu book</main>;
}
