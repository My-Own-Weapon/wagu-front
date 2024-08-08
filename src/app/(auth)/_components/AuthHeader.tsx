'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import BackBtn from '@components/BackBtn';
import Heading from '@/components/ui/Heading';
import { ReactNode } from 'react';

import s from './AuthHeader.module.scss';

const headerConfig = {
  login: {
    title: '로그인',
    goto: '/entry',
  },
  signup: {
    title: '회원가입',
    goto: '/entry',
  },
} as const;

export default function AuthHeader() {
  const segment = useSelectedLayoutSegment();

  if (segment === 'entry') return null;

  const { title, goto } = headerConfig[segment as keyof typeof headerConfig];

  return (
    <Header>
      <Header.Left>
        <BackBtn goto={goto} />
      </Header.Left>
      <Header.Center>
        <Heading
          as="h2"
          fontSize="20px"
          fontWeight="semiBold"
          title={title}
          color="black"
        />
      </Header.Center>
    </Header>
  );
}

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return <header className={s.container}>{children}</header>;
}

Header.Left = function HeaderLeft({ children }: HeaderProps) {
  if (!children) return null;

  return <div className={s.left}>{children}</div>;
};

Header.Center = function HeaderCenter({ children }: HeaderProps) {
  if (!children) return null;

  return <div className={s.center}>{children}</div>;
};

Header.Right = function HeaderRight({ children }: HeaderProps) {
  if (!children) return null;

  return <div className={s.right}>{children}</div>;
};
