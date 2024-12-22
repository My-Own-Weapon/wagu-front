'use client';

import {
  ButtonHTMLAttributes,
  ComponentProps,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { Button } from '@/components/headless';

import s from './index.module.scss';

export interface Props extends ComponentProps<'button'> {
  width?: string;
  height?: '48px' | '56px';
  styleType?: 'outline' | 'fill';
  type?: Exclude<ButtonHTMLAttributes<HTMLButtonElement>['type'], 'reset'>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children?: ReactNode;
}

export default function BoxButton({
  width = '100%',
  height = '48px',
  styleType = 'fill',
  type = 'button',
  onClick = undefined,
  disabled = false,
  children = undefined,
  ...rest
}: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;

    onClick(e);
  };

  return (
    <Button
      className={s.button}
      style={{
        width,
        height,
        ...BUTTON_VARIANT[styleType],
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Button>
  );
}

const BUTTON_VARIANT = {
  outline: {
    color: '#FF6B00',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FF6B00',
    borderRadius: '8px',
  },
  fill: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B00',
    border: 'none',
    borderRadius: '8px',
  },
} as const;
