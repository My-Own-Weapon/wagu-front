// ✅ button type을 좁혔음에도 타입에러 발생
/* eslint-disable react/button-has-type */

import classNames from 'classnames';
import { ButtonHTMLAttributes, HTMLProps, MouseEventHandler } from 'react';

import s from './Button.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  width?: string;
  height?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type: Exclude<ButtonHTMLAttributes<HTMLButtonElement>['type'], undefined>;
  disabled?: boolean;
  className?: string;
  // color: 'primary' | 'primary-sub' | 'red' | 'blue';
}

export default function Button({
  width = '100%',
  height = 'auto',
  text,
  onClick = undefined,
  type = 'button',
  disabled = false,
  className = undefined,
  // color = 'primary',
}: Props) {
  const btnClassNames = classNames({ [s.btn]: true }, className);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;

    onClick(e);
  };

  return (
    <button
      className={btnClassNames}
      style={{ width, height }}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
