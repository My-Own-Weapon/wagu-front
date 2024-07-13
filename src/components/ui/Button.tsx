import classNames from 'classnames';
import { ButtonHTMLAttributes, HTMLProps, MouseEventHandler } from 'react';

import s from './Button.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  width?: string;
  height?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  className?: string;
  // color: 'primary' | 'primary-sub' | 'red' | 'blue';
}

export default function Button({
  width = '100%',
  height = 'auto',
  text,
  onClick = undefined,
  type,
  disabled = false,
  className = undefined,
  // color = 'primary',
}: Props) {
  const btnClassNames = classNames({ [s.btn]: true }, className);

  // const handleClick: ChangeEventHandler<HTMLButtonElement> = (e) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;

    onClick(e);
  };

  return (
    <button
      className={btnClassNames}
      style={{ width, height }}
      // eslint-disable-next-line react/button-has-type
      type={type as 'button' | 'submit' | 'reset'}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
