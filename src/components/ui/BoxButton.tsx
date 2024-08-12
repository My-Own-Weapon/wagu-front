'use client';

import { MouseEventHandler, ReactNode } from 'react';

import s from './BoxButton.module.scss';

interface Props {
  width?: string;
  height?: '48px' | '56px';
  variant?: 'outline' | 'fill';
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function BoxButton({
  children = undefined,
  width = '100%',
  height = '48px',
  variant = 'fill',
  onClick = undefined,
}: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;

    onClick(e);
  };

  return (
    <button
      className={s.button}
      style={{
        width,
        height,
        ...BUTTON_VARIANT[variant],
      }}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
}

const BUTTON_VARIANT = {
  outline: {
    color: '#FF6B00',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FF6B00',
  },
  fill: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B00',
    border: 'none',
  },
} as const;
