/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/function-component-definition */ // for comosition

import classNames from 'classnames';
import Image from 'next/image';
import React, { ReactElement } from 'react';

import s from './UserIcon.module.scss';

/**
 * ✅ TODO: 전반적인 타입 정의가 미흡.
 */
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
    <div className={className}>
      <Image src={imgSrc} alt={alt} width={width} height={height} />
    </div>
  );
}

interface WithTextProps {
  children?: ReactElement | string;
  size?: 'small' | 'large';
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
      <div className={s.withtextIconContainer}>
        <Component {...(rest as T)} />
        <p className={className}>{children}</p>
      </div>
    );
  };
}
