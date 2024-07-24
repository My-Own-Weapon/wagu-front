'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import * as Icon from '@public/newDesign/nav/index';
import { COLORS } from '@/constants/colors';

import s from './Footer.module.scss';

interface NavItem {
  id: number;
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  href: string;
}

export default function Footer() {
  const segment = useSelectedLayoutSegment();
  if (segment === '(auth)' || segment === 'live') {
    return null;
  }

  return (
    <nav className={s.container}>
      {getNavMap().map(({ IconComponent, text, href, id }) => (
        <Link className={s.wrapper} key={`footer-${id}`} href={href}>
          <div className={s.iconArea}>
            <IconComponent fill={COLORS.ICON_FILL} />
            <p className={s.text}>{text}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
}

function getNavMap(): NavItem[] {
  return [
    { id: 1, IconComponent: Icon.HomeSVG, text: 'Home', href: '/' },
    { id: 2, IconComponent: Icon.TropySVG, text: 'Vote', href: '/map' },
    { id: 3, IconComponent: Icon.PlusSVG, text: '', href: '/write' },
    { id: 4, IconComponent: Icon.MapPinSVG, text: 'Map', href: '/map' },
    { id: 5, IconComponent: Icon.LiveSVG, text: 'Live', href: '/live' },
  ] as const;
}
