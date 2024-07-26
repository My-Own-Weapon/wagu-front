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
  size?: 'xSmall' | 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  border?: string;
  fontSize?: 'small' | 'medium' | 'large';
  color?: 'white' | 'black';
  imgSrc: string;
  alt: string;
  children?: ReactElement | string;
}

export function UserIcon({
  shape = 'circle',
  border = 'none',
  size = 'medium',
  imgSrc,
  alt,
}: UserIconProps) {
  const className = classNames({
    [s.circleIcon]: shape === 'circle',
    [s.squareIcon]: shape === 'square',
  });

  const sizeMap = {
    xSmall: 24,
    small: 40,
    medium: 44,
    large: 48,
  };

  return (
    <div className={className} style={{ border }}>
      <Image
        src={imgSrc}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
      />
    </div>
  );
}

interface WithTextProps {
  children?: ReactElement | string;
  fontSize?: 'small' | 'medium' | 'large';
  color?: 'white' | 'black';
}

export function WithText<T extends WithTextProps>(
  Component: React.ComponentType<T>,
) {
  return ({ children, fontSize = 'small', color = 'white', ...rest }: T) => {
    const className = classNames({
      [s.smallName]: fontSize === 'small',
      [s.mediumName]: fontSize === 'medium',
      [s.largeName]: fontSize === 'large',
    });

    return (
      <div className={s.withtextIconContainer}>
        <Component {...(rest as T)} />
        <p
          className={className}
          style={{
            color: color === 'white' ? '#fff' : '#5C5C5C',
          }}
        >
          {children}
        </p>
      </div>
    );
  };
}
