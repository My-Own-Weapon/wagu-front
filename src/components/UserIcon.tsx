import classNames from 'classnames';
import Image from 'next/image';
import { ReactElement } from 'react';

import s from './UserIcon.module.scss';

export interface UserIconProps {
  width: number;
  height: number;
  size: 'small' | 'large';
  shape?: 'circle' | 'square';
  imgSrc: string;
  alt: string;
  children?: ReactElement | string;
}

export function UserIcon({
  width,
  height,
  size,
  shape,
  imgSrc,
  alt,
}: UserIconProps) {
  const className = classNames({
    [s.circleIcon]: shape === 'circle',
    [s.squareIcon]: shape === 'square',
  });

  return (
    <Image
      className={className}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
    />
  );
}

interface WithTextProps {
  children?: ReactElement | string;
  size: 'small' | 'large'; // size 속성 추가
}

export function WithText<T extends WithTextProps>(
  Component: React.ComponentType<T>,
) {
  return ({ children, ...rest }: T) => {
    const className = classNames({
      [s.smallUserName]: rest.size === 'small',
      [s.largeUserName]: rest.size === 'large',
    });

    return (
      <div className={s.container}>
        <Component {...(rest as T)} />
        <p className={className}>{children}</p>
      </div>
    );
  };
}
