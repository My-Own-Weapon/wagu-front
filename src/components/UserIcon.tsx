/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/function-component-definition */ // for comosition

import classNames from 'classnames';
import Image from 'next/image';
import React, { ReactElement } from 'react';

import s from './UserIcon.module.scss';

export interface UserIconProps {
  width: number;
  height: number;
  size?: 'small' | 'large';
  shape?: 'circle' | 'square';
  imgSrc: string;
  alt: string;
  children?: ReactElement | string;
}

export function UserIcon({
  width,
  height,
  shape = 'circle',
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
  size: 'small' | 'large';
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
