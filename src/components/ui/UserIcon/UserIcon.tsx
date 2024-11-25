import classNames from 'classnames';
import Image from 'next/image';
import React, { createContext, useContext, ReactElement, useMemo } from 'react';

import s from './UserIcon.module.scss';

interface UserIconContextType {
  size: 'xSmall' | 'small' | 'medium' | 'large';
  shape: 'circle' | 'square';
  border?: string;
}
const UserIconContext = createContext<UserIconContextType | undefined>(
  undefined,
);

export default (function UserIcon() {
  return {
    Root: UserIcon__Root,
    Image: UserIcon__Image,
    Text: UserIcon__Text,
  };
})();

interface RootProps extends UserIconContextType {
  children: ReactElement | ReactElement[];
}
function UserIcon__Root({ children, size, shape, border = 'none' }: RootProps) {
  const value = useMemo(() => ({ size, shape, border }), [size, shape, border]);

  return (
    <UserIconContext.Provider value={value}>
      <div className={s.withtextIconContainer}>{children}</div>
    </UserIconContext.Provider>
  );
}

interface ImageProps {
  imgSrc?: string;
  alt: string;
}
function UserIcon__Image({
  imgSrc = 'profile/profile-default-icon-male.svg',
  alt,
}: ImageProps) {
  const context = useContext(UserIconContext);
  if (!context) {
    throw new Error('UserIcon.Image must be used within UserIcon.Root');
  }

  const { size, shape, border } = context;

  const className = classNames({
    [`${s.circleIcon}`]: shape === 'circle',
    [`${s.squareIcon}`]: shape === 'square',
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

interface TextProps {
  children: ReactElement | string;
  fontSize?: 'small' | 'medium' | 'large';
  color?: 'white' | 'black';
}
function UserIcon__Text({
  children,
  fontSize = 'small',
  color = 'white',
}: TextProps) {
  const className = classNames({
    [`${s.smallName}`]: fontSize === 'small',
    [`${s.mediumName}`]: fontSize === 'medium',
    [`${s.largeName}`]: fontSize === 'large',
  });

  return (
    <p
      className={className}
      style={{
        color: color === 'white' ? '#fff' : '#5C5C5C',
      }}
    >
      {children}
    </p>
  );
}
