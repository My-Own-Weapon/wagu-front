'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import BackBtn from './BackBtn';
import s from './BackHeader.module.scss';

const headerConfig = {
  login: {
    title: '로그인',
    goto: '/entry',
  },
  signup: {
    title: '회원가입',
    goto: '/entry',
  },
  posts: {
    title: null,
    goto: 'back',
  },
  write: {
    title: null,
    goto: 'back',
  },
};

export default function BackHeader() {
  const segment = useSelectedLayoutSegment();

  if (!segment || segment === 'entry') return null;

  const { title, goto } = headerConfig[segment as keyof typeof headerConfig];

  return (
    <div className={s.headerContainer}>
      <BackBtn goto={goto} />
      <h2 className={s.headerTitle}>{title}</h2>
    </div>
  );
}
