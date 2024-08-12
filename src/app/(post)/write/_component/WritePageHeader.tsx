'use client';

import { ReactNode } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';

import BackBtn from '@components/BackBtn';

import s from './WritePageHeader.module.scss';

export default function WritePageHeader() {
  const segment = useSelectedLayoutSegment();

  if (segment === 'entry') return null;

  return (
    <Header>
      <Header.Left>
        <BackBtn goto="back" />
      </Header.Left>
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
